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

export function getTableData(database: string, statement: string, cb: (err, results: string) => void) {
    cb(null, "INSERT INTO")
}
