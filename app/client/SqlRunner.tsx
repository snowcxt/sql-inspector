import React = require("react");
import TypedReact = require("typed-react");

import DbPicker = require("./DbPicker");
var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');
var Select = require('react-select');

import DbHelper = require("../server/DbHelper");
import DbLogs = require("../server/DbLogs");

import async = require('async');

class SqlRunner extends TypedReact.Component<{
    ref: string;
    statement: string;
    databases: string[];
    setLogs: (logs: any[]) => void;
}, {
        defaultDb?: string;
        monioredDatabases?: string[];
        defaultDbDisabled?: boolean;
        runnerDisabled?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;

    getStatement(): string {
        return this.editor ? this.editor.getDoc().getValue() : "";
    }

    getInitialState() {
        return {
            showConnector: true,
            dbConnection: null,
            defaultDb: false,
            monioredDatabases: [],
            defaultDbDisabled: true,
            runnerDisabled: true
        };
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
                    this.props.setLogs(logs);
                    callback(null, null);
                });
            }
        ], (err, recordset) => {
            DbLogs.cleanLog(this.state.monioredDatabases, (cleanErr)=>{
                if (err)  console.log("err", err);
                if (cleanErr)  console.log("cleanErr", cleanErr);
            });
        });
    }

    setDatabases(databases: string[]) {
        this.setState({
            monioredDatabases: databases,
            defaultDbDisabled: databases.length <= 0,
            runnerDisabled: databases.length <= 0,
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

    render() {
        return this.props.databases && this.props.databases.length > 0 ? (
            <div>
                <DbPicker databases={this.props.databases} setDatabases={this.setDatabases}></DbPicker>
                <p className= "sql-editor" >
                    <textarea ref="statement" defaultValue={this.props.statement}></textarea>
                </p>
                <div className="input-group">
                    <select className="form-control" disabled={this.state.defaultDbDisabled} placeholder="Select default database ..." value={this.state.defaultDb} onChange={this.onDefaultDbChange}>
                    {
                    this.state.monioredDatabases.map((db) => {
                        return (<option key={db}>{db}</option>);
                    })
                    }
                    </select>
                    <span className="input-group-btn">
                        <button className="btn btn-primary" disabled={this.state.runnerDisabled} onClick={this.runStatement}>
                            <i className="glyphicon glyphicon-play"></i>
                            Run
                        </button>
                    </span>
                </div>
            </div>) : null;
    }
}

export = TypedReact.createClass(SqlRunner);
