var fs = require('fs');
import _ = require("lodash");
var AppDirectory = require('appdirectory');
var dirs = new AppDirectory('sql-seer');

function getSettings(cb: (err, settings?: ISettings) => void) {
    fs.readFile(getSettingFile(), 'utf8', function(err, data) {
        if (err) {
            return cb(null, { databases: [] });
        }
        if (data) {
            cb(null, JSON.parse(data));
        } else {
            cb(null, { databases: [] });
        }
    });
}

function setSettings(settings: ISettings, cb) {
    var value = settings ? JSON.stringify(settings) : "";
    fs.writeFile(getSettingFile(), value, cb);
}

export function getSettingFile() {
    return dirs.userConfig() + "/settings.json";
}

export function getDb(cb: (err, databases?: IDbConnection[]) => void) {
    getSettings((err, settings) => {
        if (err) return cb(err);
        cb(null, settings.databases || []);
    });
}

export function saveDb(database: IDbConnection, rememberPassword: boolean, cb) {
    getSettings((err, settings) => {
        if (err) return cb(err);
        var dbConfig: IDbConnection = {
            user: database.user,
            server: database.server,
            password: rememberPassword ? database.password : null
        };
        if (!settings.databases) {
            settings.databases = [];
        }
        var index = _.findIndex(settings.databases, (db) => {
            return db.server === dbConfig.server;
        });
        if (index > -1) {
            settings.databases[index] = dbConfig;
        } else {
            settings.databases.push(dbConfig);
        }

        setSettings(settings, cb);
    })
}
