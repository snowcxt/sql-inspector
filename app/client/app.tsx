import React = require("react");
import TypedReact = require("typed-react");

import SqlRunner = require("./SqlRunner");
import Uploader = require("./Uploader");
import DbPicker = require("./DbPicker");
import SqlExecTree = require("./SqlExecTree");

class App extends TypedReact.Component<any, {
    logs: any[]
}>{
    databases: string[] = [];
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

    setDatabases(databases: string[]) {
        this.databases = databases;
    }

    render() {
        return (
            <div>
                <p>
                    <Uploader setLogs={this.setLogs}></Uploader>
                </p>
                <DbPicker setDatabases={this.setDatabases}></DbPicker>
                <SqlRunner setLogs={this.setLogs}></SqlRunner>
                <p className="well">
                    <SqlExecTree logs={this.state.logs}></SqlExecTree>
                </p>
            </div>);
    }
}

export = TypedReact.createClass(App);
