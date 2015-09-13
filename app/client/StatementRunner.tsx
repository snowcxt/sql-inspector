import React = require("react");
import TypedReact = require("typed-react");

import DbLogs = require("../server/DbLogs");
import EventEmitter = require("./EventEmitter");
import Async = require('async');

var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');

class StatementRunner extends TypedReact.Component<{
    ref: string;
    statement: string;
    monioredDatabases: string[];
}, {
        defaultDb?: string;
        underMonitor?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;

    getInitialState() {
        return {
            defaultDb: "",
            underMonitor: false
        };
    }

    getStatement(): string {
        return this.editor ? this.editor.getDoc().getValue() : "";
    }

    componentDidMount() {
        EventEmitter.Emitter.addListener(EventEmitter.Types.START_MONITOR, (underMonitor) => {
            this.setState({
                underMonitor: underMonitor
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            defaultDb: nextProps.monioredDatabases.length > 0 ? nextProps.monioredDatabases[0] : ""
        });

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

        Async.series([
            (callback) => {
                DbLogs.setup(this.props.monioredDatabases, callback);
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
            DbLogs.cleanLog(this.props.monioredDatabases, (cleanErr) => {
                if (err)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, err);
                if (cleanErr)
                    return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, cleanErr);
                return EventEmitter.Emitter.emit(EventEmitter.Types.ERROR, "");
            });
        });
    }

    onDefaultDbChange(e) {
        var dbname = e.target.value;
        this.setState({
            defaultDb: dbname
        });
    }

    render() {
        return (<div>
        <p className="sql-editor">
            <textarea ref="statement" defaultValue={this.props.statement}></textarea>
            </p>
        <div className="input-group">
            <select className="form-control"  placeholder="Select default database ..." disabled={this.props.monioredDatabases.length <= 0} value={this.state.defaultDb} onChange={this.onDefaultDbChange}>
            {
            this.props.monioredDatabases.map((db) => {
                return (<option key={db}>{db}</option>);
            })
            }
                </select>
            <span className="input-group-btn">
                <button className="btn btn-primary" disabled={this.props.monioredDatabases.length <= 0 || this.state.underMonitor} onClick={this.runStatement}>
                    <i className="glyphicon glyphicon-play"></i>
                    Run
                    </button>
                </span>
            </div>
            </div>);
    }
}

export = TypedReact.createClass(StatementRunner);
