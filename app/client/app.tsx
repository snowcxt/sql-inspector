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
}>{
    getInitialState() {
        return {
            logs: [],
            databases:[]
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
                    <Uploader setLogs={this.setLogs}></Uploader>
                    <button className="btn btn-default" onClick={this.saveLogs}>
                        <i className="glyphicon glyphicon-save"></i>
                        Save
                    </button>
                    <button type="button" className="btn btn-default" data-toggle="modal" data-target="#connect-server-model">
                        Connect to db
                    </button>
                </p>
                <p>
                    <SqlRunner setLogs={this.setLogs} databases={this.state.databases}></SqlRunner>
                </p>
                <br />
                <div className="tree">
                    <SqlExecTree logs={this.state.logs}></SqlExecTree>
                </div>
                <div className="modal fade" id="connect-server-model" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" dangerouslySetInnerHTML={{__html: '&times;'}} /></button>
                            <h4 className="modal-title">Connect to Server</h4>
                          </div>
                          <div className="modal-body">
                            <DbConnector setConnection={this.setConnection}></DbConnector>
                          </div>
                        </div>
                  </div>
                </div>
            </div>);
    }
}

export = TypedReact.createClass(App);
