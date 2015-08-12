var sql = require('mssql');
import _ = require("lodash");
interface IDbConfig {

}
var config = {
    user: 'admin',
    password: 'password',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'longford',

    options: {
        // encrypt: true // Use this if you're on Windows Azure
    }
}

export function exec(dbName: string, statement: string, cb: (err, recordset?) => void) {
    var con = _.cloneDeep(config);
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
