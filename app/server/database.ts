var sql = require('mssql');
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

export var exec = function(dbName: string, statement: string, cb: (err, recordset?) => void) {
    var connection = new sql.Connection(config, function(err) {
        if (err) return cb(err);

        var request = new sql.Request(connection); // or: var request = connection.request();
        request.query(statement, function(err, recordset) {
            if (err) return cb(err);

            cb(null, recordset);
        });
    });
};
