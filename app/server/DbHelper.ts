var sql = require('mssql');
import _ = require("lodash");
import Settings = require("./Settings");

var defaultConfig: IDbConnection = {
    user: 'sa',
    password: 'password',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'master'
}

export function exec(dbName: string, statement: string, cb: (err, recordset?) => void) {
    defaultConfig.database = dbName;
    var connection = new sql.Connection({
        user: defaultConfig.user,
        password: defaultConfig.password,
        server: defaultConfig.server,
        database: dbName
    }, function(err) {
        if (err) return cb(err);

        var request = new sql.Request(connection); // or: var request = connection.request();
        request.query(statement, cb);
    });
}

export function setConfig(config: IDbConnection, rememberPassword: boolean, cb: (err: any, databases?: string[]) => void) {
    config.database = "master";

    var connection = new sql.Connection(config, function(err) {
        if (err) return cb(err);

        var request = new sql.Request(connection); // or: var request = connection.request();
        request.query("SELECT name FROM sys.databases", function(err, recordset) {
            if (err) return cb(err);
            defaultConfig = config;
            Settings.saveDb(config, rememberPassword, () => {
                if (err) return cb(err);

                cb(null, recordset.map((result) => {
                    return result.name;
                }));
            });
        });
    });
}

var valuesStatement = _.template("VALUES(<%= values %>)");
var insertStatement = _.template(
    "INSERT INTO <%= table %> " +
    "(<%= columns %>) <%= rows %>");

function formatValue(value): string {
    if (_.isNull(value)) {
        return "null"
    }
    if (_.isDate(value)) {
        return "'" + value.toISOString() + "'";
    }
    else {
        return "'" + value + "'";
    }
}

export function getTableData(database: string, statement: string, cb: (err, results?: string) => void) {
    exec(database, statement, (err, resultset: Object[]) => {
        if (err) return cb(err);

        if (resultset && resultset.length > 0) {
            var columns: string[] = [];
            _.forEach(resultset[0], (n, key) => {
                columns.push(key);
            });

            var values: string[] = [];
            _.forEach(resultset, (row) => {
                var arr = [];
                _.forEach(columns, (key) => {
                    arr.push(formatValue(row[key]));
                });
                values.push(valuesStatement({
                    values: arr.join(", ")
                }))
            });

            return cb(null, insertStatement({
                table: "[table]",
                columns: columns.join(", "),
                rows: values.join(" ")
            }));
        }

        return cb(null, "");
    });

}
