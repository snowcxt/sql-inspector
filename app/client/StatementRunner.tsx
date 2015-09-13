import React = require("react");
import TypedReact = require("typed-react");

import DbLogs = require("../server/DbLogs");
import EventEmitter = require("./EventEmitter");
import Async = require('async');
import $ = require("jquery");

var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');

class StatementRunner extends TypedReact.Component<{
    ref: string;
    statement: string;
    monioredDatabases: string[];
}, {
        error?:string;
        defaultDb?: string;
        underMonitor?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;

    getInitialState() {
        return {
            error:"",
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

        $('#statement-runner').on('shown.bs.modal',  (e) => {
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
                if (err) return this.setState({error: err.message});
                if (cleanErr) return this.setState({error: cleanErr});
                this.setState({error: ""});
                $('#statement-runner').modal('hide');
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
        var style = {display: "inline"};
        return (
        <div style={style}>
        {
            this.state.underMonitor ? null :
            <button className="btn btn-primary btn-sm" disabled={this.props.monioredDatabases.length <= 0} data-toggle="modal" data-target="#statement-runner"><i className="glyphicon glyphicon-play"></i>{' '}Run statement</button>
        }
            <div className="modal fade" id="statement-runner" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                            <h4 className="modal-title" id="myModalLabel">Run Sql</h4>
                        </div>
                        <div className="modal-body">
                        {
                            this.state.error ? (
                                <p className="alert alert-danger" role="alert">
                                    <button type="button" className="close" aria-label="Close" onClick={()=>{
                                        this.setState({error: ""});
                                    }}>
                                        <span aria-hidden="true" dangerouslySetInnerHTML={{__html: '&times;'}}></span></button>
                                    {this.state.error}
                                </p>) : null
                        }
                            <p className="sql-editor">
                                <textarea ref="statement" defaultValue={this.props.statement} />
                            </p>
                            <div className="input-group">
                                <select className="form-control" placeholder="Select default database ..." disabled={this.props.monioredDatabases.length <= 0} value={this.state.defaultDb} onChange={this.onDefaultDbChange}>
                                    {
                                    this.props.monioredDatabases.map((db) => {
                                        return (<option key={db}>{db}</option>);
                                    })
                                    }
                                </select>
                                <span className="input-group-btn">
                                <button className="btn btn-primary" onClick={this.runStatement}>
                                    <i className="glyphicon glyphicon-play"></i>
                                    Run
                                </button>
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export = TypedReact.createClass(StatementRunner);
