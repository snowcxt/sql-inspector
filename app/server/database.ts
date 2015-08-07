declare var require:any;

var sql = require('mssql');

var config = {
    user: 'admin',
    password: 'password',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'longford',

    options: {
        // encrypt: true // Use this if you're on Windows Azure
    }
}

export var query = function (query, cb) {
    var connection = new sql.Connection(config, function (err) {
        if (err) return cb(err);

        var request = new sql.Request(connection); // or: var request = connection.request();
        request.query(query, function (err, recordset) {
            if (err) return cb(err);

            cb(null, recordset);
        });
    });
};
