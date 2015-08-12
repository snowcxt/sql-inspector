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
        monioredDatabases: Array<{ value: string; label: string; }>
    }>{
    private editor: CodeMirror.EditorFromTextArea;
    private defaultDb: string;

    getInitialState() {
        return {
            monioredDatabases: []
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

    onDefaultDbChange(dbname: string) {
        this.defaultDb = dbname;
    }

    render() {
        return (
            <p>
            <DbPicker setDatabases={(databases: string[]) => {
                this.setState({
                    monioredDatabases: databases.map((db) => {
                        return { value: db, label: db }
                    })
                });
            } }></DbPicker>
            <p className= "sql-editor" >
            <textarea ref="statement"></textarea>
            </p >
            <p>
                <Select searchable={true} placeholder="Select default database ..." value={this.defaultDb} onChange={this.onDefaultDbChange} options={this.state.monioredDatabases}></Select>

                <button className="btn btn-sm btn-primary" onClick={this.runStatement}>
                    <i className="glyphicon glyphicon-play"></i>
                    Run
                </button>
            </p>
            </p >
        );
    }
}

export = TypedReact.createClass(SqlRunner);
