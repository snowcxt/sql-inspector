var events = require('events');
export var Emitter = new events.EventEmitter();
export var Types = {
    DB_CONNCTED: "DB_CONNCTED",
    LOG_CHANGED: "LOG_CHANGED",
    ERROR: "ERROR"
};
