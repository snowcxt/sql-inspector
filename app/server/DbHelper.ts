var sql = require('mssql');
import _ = require("lodash");

var defaultConfig: IDbConnection = {
    user: 'admin',
    password: 'password',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'longford'
}

export function setDefaultConfig(config: IDbConnection) {
    defaultConfig = config;
}

export function exec(dbName: string, statement: string, cb: (err, recordset?) => void) {
    var con = _.cloneDeep(defaultConfig);
    con.database = dbName;
    var connection = new sql.Connection(con, function(err) {
        if (err) return cb(err);

        var request = new sql.Request(connection); // or: var request = connection.request();
        request.query(statement, function(err, recordset) {
            if (err) return cb(err);

            cb(null, recordset);
        });
    });
};

export function getDatases(cb) {
    exec("master", "SELECT name FROM sys.databases", (err, results: Array<{ name: string }>) => {
        if (err) return cb(err);

        cb(null, results.map((result) => {
            return result.name;
        }));
    });
}
