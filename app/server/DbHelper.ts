import db = require("./database");

export function getDatases(cb) {
    db.exec("master", "SELECT name FROM sys.databases", (err, results: Array<{ name: string }>) => {
        if (err) return cb(err);

        cb(null, results.map((result) => {
            return result.name;
        }));
    });
}
