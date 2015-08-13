import React = require("react");
import TypedReact = require("typed-react");

import DbPicker = require("./DbPicker");
var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');
var Select = require('react-select');
import DbLogs = require("../server/DbLogs");
import async = require('async');

class SqlRunner extends TypedReact.Component<{
    setLogs: (logs: any[]) => void;
}, {
        monioredDatabases?: Array<{ value: string; label: string; }>;
        defaultDbDisabled?: boolean;
        runnerDisabled?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;
    private defaultDb: string;

    getInitialState() {
        return {
            monioredDatabases: [],
            defaultDbDisabled: true,
            runnerDisabled: true
        };
    }

    componentDidMount() {
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

    runStatement() {
        var statment = this.editor.getDoc().getValue();
        async.series([
            (callback) => {
                DbLogs.setup([this.defaultDb], callback);
            },
            (callback) => {
                DbLogs.runQuery(this.defaultDb, statment, false, callback);
            },
            (callback) => {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    if (err) return callback(err, null);
                    this.props.setLogs(logs);
                    callback(null, null);
                });
            },
            (callback) => {
                DbLogs.cleanLog([this.defaultDb], callback);
            }
        ], (err, recordset) => {
            if (err) return console.log("err", err);
        });
    }

    setDatabases(databases: string[]) {
        this.setState({
            monioredDatabases: databases.map((db) => {
                return { value: db, label: db }
            }),
            defaultDbDisabled: databases.length <= 0,
            runnerDisabled: databases.length !== 1
        });
        if (databases.length === 1) {
            this.defaultDb = databases[0];
        } else {
            this.defaultDb = "";
        }
    }

    onDefaultDbChange(dbname: string) {
        this.defaultDb = dbname;
        this.state.runnerDisabled = !this.defaultDb;
    }

    render() {
        return (
            <p>
                <DbPicker setDatabases={this.setDatabases}></DbPicker>
                <p>
                    <Select disabled={this.state.defaultDbDisabled} searchable={true} placeholder="Select default database ..." value={this.defaultDb} onChange={this.onDefaultDbChange} options={this.state.monioredDatabases}></Select>
                </p>
                <p className="sql-editor" >
                    <textarea ref="statement"></textarea>
                </p >
                <button className="btn btn-sm btn-primary" disabled={this.state.runnerDisabled} onClick={this.runStatement}>
                    <i className="glyphicon glyphicon-play"></i>
                    Run
                </button>
            </p>
        );
    }
}

export = TypedReact.createClass(SqlRunner);
