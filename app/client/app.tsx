import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");
import SqlRunner = require("./SqlRunner");
import Uploader = require("./Uploader");
import SqlExecTree = require("./SqlExecTree");
import DbConnector = require("./DbConnector");
import EventEmitter = require("./EventEmitter");
import VersionChecker = require("./VersionChecker");
import Footer = require("./Footer");

class App extends TypedReact.Component<{}, {
    logs?: any[];
    error?: string;
    statement?: string;
}>{
    getInitialState() {
        return {
            statement:"",
            logs: [],
            error: ""
        };
    }

    componentDidMount() {
        EventEmitter.Emitter.addListener(EventEmitter.Types.DB_CONNCTED, (databases) => {
            $("#connect-server-model").modal('hide');
            this.setState({
                databases: databases
            });
        });

        EventEmitter.Emitter.addListener(EventEmitter.Types.ERROR, (error) => {
            this.setState({
                error: error
            });
        });

        EventEmitter.Emitter.addListener(EventEmitter.Types.LOG_CHANGED, (logs) => {
            this.setState({
                logs: logs
            });
        });
    }

    setRecord(logs:any[], statement:string){
        this.setState({
            logs: logs,
            statement:statement
        });
    }

    saveLogs() {
        var query = (this.refs["sql-runner"] as any).getStatement();

        download(new Blob([JSON.stringify({
            log: this.state.logs,
            query: query
        })]), "log.json", "text/plain");
    }

    render() {
        return (
            <div>
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
                <div className="pull-right">
                <VersionChecker />
                </div>
                <p className="btn-group btn-group-sm" role="group" aria-label="...">
                    <Uploader onUploaded={this.setRecord} />
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
                    <SqlRunner ref="sql-runner" statement={this.state.statement} />
                </p>
                <br />
                <div className="tree well">
                    <SqlExecTree />
                </div>
                <div className="modal fade" id="connect-server-model" role="dialog">
                    <DbConnector />
                </div>
                <Footer />
            </div>);
    }
}

export = TypedReact.createClass(App);
