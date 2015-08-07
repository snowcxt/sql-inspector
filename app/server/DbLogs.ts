import db = require("./database");
import _ = require('lodash');
import async = require('async');
var glob = require("glob");
var del = require('delete');

var AuditName = "AuditTableQuery_129831091";
var AuditSpecificationName = AuditName + "_specification";

function getAuditFileLocation() {
    return "d:\\";
}

function getAuditFile() {
    return getAuditFileLocation() + AuditName + "*.sqlaudit";
}

export function runQuery(dbName: string, query: string, autoRollback: boolean, cb) {
    if (autoRollback) {
        query = "BEGIN TRANSACTION " + query + " ROLLBACK TRANSACTION";
    }

    db.exec(dbName, query, cb);
}

var getLogsQuery = _.template("SELECT event_time, action_id, database_name, object_name, statement , additional_information, audit_file_offset FROM sys.fn_get_audit_file('<%= auditFile %>', DEFAULT, DEFAULT) WHERE schema_name = 'dbo'")({ auditFile: getAuditFile });

export function getNewLogs(cb) {
    db.exec("master", getLogsQuery, cb);
}

var cleanAuditSpecificationQuery = _.template("ALTER DATABASE AUDIT SPECIFICATION [<%= auditSpec %>]  WITH (STATE = OFF) DROP DATABASE AUDIT SPECIFICATION [<%= auditSpec %>]")({
    auditSpec: AuditSpecificationName
});

function cleanAuditSpecification(dbName: string, cb) {
    db.exec("dbName", cleanAuditSpecificationQuery, cb);
}

var dropServerAudit = _.template("ALTER SERVER AUDIT [<%= audit %>] WITH (STATE = OFF) DROP SERVER AUDIT [<%= audit %>]")({
    audit: AuditName
});

export function CleanLog(databases: string[], cb) {
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
            glob("d:/" + AuditName + "*.sqlaudit", null, function(err, files: string[]) {
                if (err) return callback(err, null);
                // files is an array of filenames.
                // If the `nonull` option is set, and nothing
                // was found, then files is ["**/*.js"]
                // er is an error object or null.
                _.each(files, (file) => {
                    del.sync(file);
                });
                callback(null, null);
            });
        }
    ], cb);
}
