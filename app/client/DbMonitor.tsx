import React = require("react");
import TypedReact = require("typed-react");

import DbLogs = require("../server/DbLogs");
import EventEmitter = require("./EventEmitter");
import Async = require('async');

class DbMonitor extends TypedReact.Component<{
    monioredDatabases: string[];
}, {
        underMonitor: boolean;
    }>{
    getInitialState() {
        return {
            underMonitor: false
        };
    }

    getNewLogInverval() {
        setTimeout(() => {
            if (this.state.underMonitor) {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    if (err) return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, err);
                    EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, logs);
                });
                this.getNewLogInverval();
            }
        }, 250);
    }

    monitorDb() {
        EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, []);
        EventEmitter.Emitter.emit(EventEmitter.Types.START_MONITOR, true);
        DbLogs.setup(this.props.monioredDatabases, () => {
            this.setState({
                underMonitor: true
            });
            this.getNewLogInverval();
        });
    }

    stopMonitor() {
        Async.series([
            (callback) => {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    if (err) return callback(err, null);
                    EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, logs);
                    callback(null, null);
                });
            }
        ], (err, recordset) => {
            DbLogs.cleanLog(this.props.monioredDatabases, (cleanErr) => {
                this.setState({
                    underMonitor: false
                });
                EventEmitter.Emitter.emit(EventEmitter.Types.START_MONITOR, false);
                if (err)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, err);
                if (cleanErr)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, cleanErr);
                return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, "");
            });
        });
    }
    render() {
        return !this.state.underMonitor ?
            <button className="btn btn-sm btn-primary" onClick={this.monitorDb} disabled={this.props.monioredDatabases.length <= 0}>monitor</button> :
            <button className="btn btn-sm btn-danger" onClick={this.stopMonitor}>
            <i className="blink glyphicon glyphicon-record"/>{' '}
            stop monitor
                </button>
            ;
    }
}

export = TypedReact.createClass(DbMonitor);
