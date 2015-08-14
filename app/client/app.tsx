import React = require("react");
import TypedReact = require("typed-react");

import SqlRunner = require("./SqlRunner");
import Uploader = require("./Uploader");
import SqlExecTree = require("./SqlExecTree");

class App extends TypedReact.Component<any, {
    logs: any[]
}>{
    getInitialState() {
        return {
            logs: []
        };
    }

    setLogs(logs: any[]) {
        this.setState({
            logs: logs
        });
    }

    saveLogs() {
        download(new Blob([JSON.stringify({
            log: this.state.logs,
            query: ""
        })]), "log.json", "text/plain");
    }

    render() {
        return (
            <div>
                <p>
                    <Uploader setLogs={this.setLogs}></Uploader>
                </p>
                <SqlRunner setLogs={this.setLogs}></SqlRunner>
                <div className="well tree">
                    <SqlExecTree logs={this.state.logs}></SqlExecTree>
                </div>
                <p>
                    <button className="btn btn-sm btn-default" onClick={this.saveLogs}>
                        <i className="glyphicon glyphicon-save"></i>
                        Save
                    </button>
                </p>
            </div>);
    }
}

export = TypedReact.createClass(App);
