import React = require("react");
import TypedReact = require("typed-react");

import DbPicker = require("./DbPicker");
import DbConnector = require("./DbConnector");
var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');
var Select = require('react-select');

import DbHelper = require("../server/DbHelper");
import DbLogs = require("../server/DbLogs");

import async = require('async');

class SqlRunner extends TypedReact.Component<{
    setLogs: (logs: any[]) => void;
}, {
        showConnector?: boolean;
        dbConnection?: IDbConnection;
        defaultDb?: string;
        monioredDatabases?: Array<{ value: string; label: string; }>;
        defaultDbDisabled?: boolean;
        runnerDisabled?: boolean;
    }>{
    private editor: CodeMirror.EditorFromTextArea;

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
                DbLogs.setup([this.state.defaultDb], callback);
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
            },
            (callback) => {
                DbLogs.cleanLog([this.state.defaultDb], callback);
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
            runnerDisabled: databases.length !== 1,
            defaultDb: databases.length === 1 ? databases[0] : ""
        });
    }

    onDefaultDbChange(dbname: string) {
        this.setState({
            defaultDb: dbname,
            runnerDisabled: !dbname
        });
    }

    setConnection(config: IDbConnection, rememberPassword: boolean) {
        this.setState({
            showConnector: false,
            DbConnection: config
        });
        this.setDatabases([]);

        if (config) {
            DbHelper.setDefaultConfig(config);
        }
    }

    render() {
        return this.state.showConnector ?
            (<DbConnector setConnection={this.setConnection}></DbConnector>) :
            (<div>
                <DbPicker setDatabases={this.setDatabases}></DbPicker>
                <p>
                    <Select disabled={this.state.defaultDbDisabled} searchable={true} placeholder="Select default database ..." value={this.state.defaultDb} onChange={this.onDefaultDbChange} options={this.state.monioredDatabases}></Select>
                </p>
                <p className= "sql-editor" >
                    <textarea ref="statement"></textarea>
                </p >
                <button className="btn btn-sm btn-primary" disabled={this.state.runnerDisabled} onClick={this.runStatement}>
                    <i className="glyphicon glyphicon-play"></i>
                    Run
                </button>
            </div>);
    }
}

export = TypedReact.createClass(SqlRunner);
