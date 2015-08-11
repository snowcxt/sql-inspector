import db = require("./database");
import _ = require('lodash');
import async = require('async');
var glob = require("glob");
var del = require('delete');

var AuditName = "AuditTableQuery_129831091";
var AuditSpecificationName = AuditName + "_specification";

function getAuditFileLocation() {
    return __dirname + "\\";
}

function getAuditFile() {
    return getAuditFileLocation() + AuditName + "*.sqlaudit";
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
    "if NOT EXISTS  (SELECT TOP 1 1 FROM sys.database_audit_specifications where name='<%= spec %>') BEGIN " +
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
    auditFile: getAuditFileLocation(),
    audit: AuditName
});

export function setup(databases: string[], cb) {
    db.exec("master", setupServerAuditQuery, (err) => {
        if (err) return cb(err);
        async.each(databases, (db, callback) => {
            setupDb(db, callback);
        }, cb);
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
    "ALTER DATABASE AUDIT SPECIFICATION [<%= auditSpec %>]  WITH (STATE = OFF) " +
    "DROP DATABASE AUDIT SPECIFICATION [<%= auditSpec %>]")({
        auditSpec: AuditSpecificationName
    });

function cleanAuditSpecification(dbName: string, cb) {
    db.exec(dbName, cleanAuditSpecificationQuery, cb);
}

var dropServerAudit = _.template(
    "ALTER SERVER AUDIT [<%= audit %>] WITH (STATE = OFF) " +
    "DROP SERVER AUDIT [<%= audit %>]")({
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
            glob(getAuditFileLocation() + AuditName + "*.sqlaudit", null, function(err, files: string[]) {
                if (err) return callback(err, null);
                // files is an array of filenames.
                // If the `nonull` option is set, and nothing
                // was found, then files is ["**/*.js"]
                // er is an error object or null.
                _.each(files, (file) => {
                    del.sync(file, { force: true });
                });
                callback(null, null);
            });
        }
    ], cb);
}
