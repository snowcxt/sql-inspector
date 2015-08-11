import React = require("react");
import TypedReact = require("typed-react");

var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');

import DbLogs = require("../server/DbLogs");
import async = require('async');

import Tree = require("./TreeNode");
import treeBuilder = require("./tree-builder");

class SqlStatement extends TypedReact.Component<any, any>{
    private editor: CodeMirror.EditorFromTextArea;
    getInitialState() {
        return {
            visible: true,
            showDetails: true
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
                DbLogs.setup(["longford"], callback);
            },
            (callback) => {
                DbLogs.runQuery("longford", statment, false, callback);
            },
            (callback) => {
                DbLogs.getNewLogs((err, logs: any[]) => {
                    var node = treeBuilder.build(logs);

                    if (err) return callback(err, null);
                    React.render(React.createElement(Tree, {
                        node: node
                    }), document.getElementById("tree"));
                    callback(null, null);
                });
            },
            (callback) => {
                DbLogs.cleanLog(["longford"], callback);
            }
        ], (err, recordset) => {
            if (err) return console.log("err", err);
        });
    }
    render() {
        return (
            <div>
                <div className="sql-editor">
                    <textarea ref="statement"></textarea>
                </div>
                <button className="btn btn-sm btn-primary" onClick={this.runStatement}>
                    <i className="glyphicon glyphicon-play"></i>
                    Run
                </button>
            </div>
        );
    }

}

export = TypedReact.createClass(SqlStatement);
