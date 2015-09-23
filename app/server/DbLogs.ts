import db = require("./DbHelper");
import _ = require('lodash');
import async = require('async');

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var AuditName = "AuditTableQuery_" + Date.now();
var AuditSpecificationName = AuditName + "_specification";
var server: string = "";

function getAuditFileLocation() {
  return ((!server || server === "localhost") ? "c\\" : "\\\\" + server + "\\c$\\") + AuditName + "\\";
}
function getAuditFileLocalLocation() {
  return "c:\\" + AuditName + "\\";
}

function getAuditFile() {
  return getAuditFileLocalLocation() + AuditName + "*.sqlaudit";
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

var createAuditSpecTemplate = _.template(
  "IF NOT EXISTS  (SELECT TOP 1 1 FROM sys.database_audit_specifications where name='<%= spec %>') BEGIN " +
  "CREATE DATABASE AUDIT SPECIFICATION [<%= spec %>]" +
  "FOR SERVER AUDIT [<%= audit %>] " +
  "ADD(DELETE ON DATABASE::<%= db %> BY [public])," +
  "ADD(EXECUTE ON DATABASE::<%= db %> BY [public])," +
  "ADD(INSERT ON DATABASE::<%= db %> BY [public])," +
  "ADD(SCHEMA_OBJECT_CHANGE_GROUP)," +
  "ADD(SELECT ON DATABASE::<%= db %> BY [public])," +
  "ADD(UPDATE ON DATABASE::<%= db %> BY [public])" +
  "WITH (STATE = ON) END");

function setupDb(dbName: string, cb) {
  db.exec(dbName, createAuditSpecTemplate({
    db: dbName,
    audit: AuditName,
    spec: AuditSpecificationName
  }), cb);
}

var setupServerAuditQuery = _.template(
  "IF NOT EXISTS  (SELECT TOP 1 1 FROM sys.server_audits where name='<%= audit %>')" +
  "BEGIN " +
  "CREATE SERVER AUDIT [<%= audit %>] " +
  "TO FILE " +
  "(FILEPATH = N'<%= auditFile %>'" +
  ",MAXSIZE = 0 MB" +
  ",MAX_ROLLOVER_FILES = 2147483647" +
  ",RESERVE_DISK_SPACE = OFF) " +
  "WITH " +
  "(QUEUE_DELAY = 0" +
  ",ON_FAILURE = CONTINUE" +
  ",AUDIT_GUID = '<%= guid %>') " +
  "END " +
  "ALTER SERVER AUDIT [<%= audit %>] WITH (STATE = ON)"
  )({
  guid: generateUUID(),
  auditFile: getAuditFileLocalLocation(),
  audit: AuditName
});

export function setup(auditServer: string, databases: string[], cb) {
  server = auditServer;
  mkdirp(getAuditFileLocation(), function(err) {
    if (err) return cb(err);

    db.exec("master", setupServerAuditQuery, (err) => {
      if (err) return cb(err);
      async.each(databases, (db, callback) => {
        setupDb(db, callback);
      }, cb);
    });
  });
}

export function runQuery(dbName: string, query: string, autoRollback: boolean, cb) {
  if (autoRollback) {
    query = "BEGIN TRANSACTION " + query + " ROLLBACK TRANSACTION";
  }

  db.exec(dbName, query, cb);
}

var getLogsQuery = _.template(
  "SELECT event_time, action_id, database_name, object_name, statement , additional_information, audit_file_offset " +
  "FROM sys.fn_get_audit_file('<%= auditFile %>', DEFAULT, DEFAULT) " +
  "WHERE schema_name = 'dbo'")({ auditFile: getAuditFile() });

export function getNewLogs(cb) {
  db.exec("master", getLogsQuery, cb);
}

var cleanAuditSpecificationQuery = _.template(
  "IF EXISTS (SELECT TOP 1 1 FROM sys.database_audit_specifications where name='<%= auditSpec %>') BEGIN " +
  "ALTER DATABASE AUDIT SPECIFICATION [<%= auditSpec %>]  WITH (STATE = OFF) " +
  "DROP DATABASE AUDIT SPECIFICATION [<%= auditSpec %>] END")({
  auditSpec: AuditSpecificationName
});

function cleanAuditSpecification(dbName: string, cb) {
  db.exec(dbName, cleanAuditSpecificationQuery, cb);
}

var dropServerAudit = _.template(
  "IF EXISTS  (SELECT TOP 1 1 FROM sys.server_audits where name='<%= audit %>')" +
  "BEGIN " +
  "ALTER SERVER AUDIT [<%= audit %>] WITH (STATE = OFF) " +
  "DROP SERVER AUDIT [<%= audit %>] END")({
  audit: AuditName
});

export function cleanLog(databases: string[], cb) {
  async.series([
    (callback) => {
      async.each(databases, (db, cleanCb) => {
        cleanAuditSpecification(db, cleanCb);
      }, (err) => {
          callback(err, {});
        });
    },
    (callback) => {
      db.exec("master", dropServerAudit, callback);
    },
    (callback) => {
      rimraf(getAuditFileLocation(), callback);
    }
  ], cb);
}
