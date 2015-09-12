import React = require("react");
import TypedReact = require("typed-react");

import DbPicker = require("./DbPicker");
var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');
var Select = require('react-select');

import DbHelper = require("../server/DbHelper");
import DbLogs = require("../server/DbLogs");

import EventEmitter = require("./EventEmitter");

import async = require('async');

class SqlRunner extends TypedReact.Component<{
    ref: string;
    statement: string;
}, {
        databases?: string[];
        defaultDb?: string;
        monioredDatabases?: string[];
        underMonitor?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;

    getStatement(): string {
        return this.editor ? this.editor.getDoc().getValue() : "";
    }

    getInitialState() {
        return {
            databases: [],
            showConnector: true,
            dbConnection: null,
            defaultDb: false,
            monioredDatabases: [],
            underMonitor: false
        };
    }

    componentDidMount() {
        EventEmitter.Emitter.addListener(EventEmitter.Types.DB_CONNCTED, (databases) => {
            this.setState({ databases: databases });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.editor && nextProps.statement !== this.props.statement) {
            this.editor.getDoc().setValue(nextProps.statement);
        }
    }

    componentDidUpdate() {
        if (!this.editor) {
            var mirror: any = this.refs["statement"];
            if (mirror) {
                this.editor = CodeMirror.fromTextArea(mirror.getDOMNode(), {
                    mode: "text/x-mssql",
                    lineNumbers: true,
                    smartIndent: true,
                    viewportMargin: Infinity,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",
                        "Ctrl-J": "autocomplete"
                    }
                });
            }
        }
    }

    runStatement() {
        var statment = this.getStatement();

        async.series([
            (callback) => {
                DbLogs.setup(this.state.monioredDatabases, callback);
            },
            (callback) => {
                DbLogs.runQuery(this.state.defaultDb, statment, false, callback);
            },
            (callback) => {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    if (err) return callback(err, null);
                    EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, logs);
                    callback(null, null);
                });
            }
        ], (err, recordset) => {
            DbLogs.cleanLog(this.state.monioredDatabases, (cleanErr) => {
                if (err)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, err);
                if (cleanErr)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, cleanErr);
                return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, "");
            });
        });
    }

    setDatabases(databases: string[]) {
        this.setState({
            monioredDatabases: databases,
            defaultDb: databases.length > 0 ? databases[0] : ""
        });
    }

    onDefaultDbChange(e) {
        var dbname = e.target.value;
        this.setState({
            defaultDb: dbname,
            runnerDisabled: !dbname
        });
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
        DbLogs.setup(this.state.monioredDatabases, () => {
            this.setState({
                underMonitor: true
            });
            this.getNewLogInverval();
        });
    }

    stopMonitor() {
        async.series([
            (callback) => {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    if (err) return callback(err, null);
                    EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, logs);
                    callback(null, null);
                });
            }
        ], (err, recordset) => {
            DbLogs.cleanLog(this.state.monioredDatabases, (cleanErr) => {
                this.setState({
                    underMonitor: false
                });

                if (err)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, err);
                if (cleanErr)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, cleanErr);
                return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, "");
            });
        });
    }

    render() {
        return this.state.databases && this.state.databases.length > 0 ? (
            <div>
                <DbPicker databases={this.state.databases} setDatabases={this.setDatabases} />
                {
                !this.state.underMonitor ?
                    <button className="btn btn-sm btn-primary" onClick={this.monitorDb} disabled={this.state.monioredDatabases.length <= 0}>monitor</button> :
                    <button className="btn btn-sm btn-danger" onClick={this.stopMonitor}>stop monitor</button>
                }
                <p className="sql-editor">
                    <textarea ref="statement" defaultValue={this.props.statement}></textarea>
                    </p>
                <div className="input-group">
                    <select className="form-control"  placeholder="Select default database ..." disabled={this.state.monioredDatabases.length <= 0} value={this.state.defaultDb} onChange={this.onDefaultDbChange}>
                    {
                    this.state.monioredDatabases.map((db) => {
                        return (<option key={db}>{db}</option>);
                    })
                    }
                        </select>
                    <span className="input-group-btn">
                        <button className="btn btn-primary" disabled={this.state.monioredDatabases.length <= 0} onClick={this.runStatement}>
                            <i className="glyphicon glyphicon-play"></i>
                            Run
                            </button>
                        </span>
                    </div>
                </div>) : null;
    }
}

export = TypedReact.createClass(SqlRunner);
