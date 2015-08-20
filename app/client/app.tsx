import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");
import SqlRunner = require("./SqlRunner");
import Uploader = require("./Uploader");
import SqlExecTree = require("./SqlExecTree");
import DbConnector = require("./DbConnector");

class App extends TypedReact.Component<any, {
    logs?: any[];
    databases?: string[];
    statement?: string;
}>{
    getInitialState() {
        return {
            statement:"",
            logs: [],
            databases:[]
        };
    }

    setRecord(logs:any[], statement:string){
        this.setState({
            logs: logs,
            statement:statement
        });
    }

    setLogs(logs: any[]) {
        this.setState({
            logs: logs
        });
    }

    saveLogs() {
        var query = (this.refs["sql-runner"] as any).getStatement();

        download(new Blob([JSON.stringify({
            log: this.state.logs,
            query: query
        })]), "log.json", "text/plain");
    }

    setConnection(databases:string[]) {
        ($("#connect-server-model") as any).modal('hide');
        this.setState({
            databases: databases
        });
    }

    render() {
        return (
            <div>
                <p className="btn-group btn-group-sm" role="group" aria-label="...">
                    <Uploader onUploaded={this.setRecord}></Uploader>
                    <button className="btn btn-default" onClick={this.saveLogs}>
                        <i className="glyphicon glyphicon-save"></i>{" "}
                        Save
                    </button>
                    <button type="button" className="btn btn-default" data-toggle="modal" data-target="#connect-server-model">
                        <i className="glyphicon glyphicon-transfer"></i>{" "}
                        Connect to Server
                    </button>
                </p>
                <p>
                    <SqlRunner ref="sql-runner" statement={this.state.statement} setLogs={this.setLogs}></SqlRunner>
                </p>
                <br />
                <div className="tree well">
                    <SqlExecTree isConnected={this.state.databases.length > 0} logs={this.state.logs}></SqlExecTree>
                </div>
                <div className="modal fade" id="connect-server-model" role="dialog" aria-labelledby="myModalLabel">
                    <DbConnector setConnection={this.setConnection}></DbConnector>
                </div>
            </div>);
    }
}

export = TypedReact.createClass(App);
