import React = require("react");
import TypedReact = require("typed-react");

import _ = require("lodash");

import DbHelper = require("../server/DbHelper");
import Settings = require("../server/Settings");

var Select = require('react-select');

class DbConnector extends TypedReact.Component<{
    setConnection: (databases: string[]) => void
}, {
        savedDatabases?: IDbConnection[]
    }>{
    getInitialState() {
        return {
            savedDatabases: []
        };
    }

    onConnect() {
        var config: IDbConnection = {
            server: (React.findDOMNode(this.refs["server-name"]) as any).value.trim(),
            password: (React.findDOMNode(this.refs["password"]) as any).value.trim(),
            user: (React.findDOMNode(this.refs["login"]) as any).value.trim()
        };
        DbHelper.setConfig(config, (React.findDOMNode(this.refs["remember-password"]) as any).checked, (err, databases) => {
            if (err) throw err;
            this.props.setConnection(databases);
        });
    }

    componentWillMount() {
        Settings.getDb((err, databases) => {
            if (err) return;
            this.setState({
                savedDatabases: databases
            });
        });
    }

selectDb(server:string){
    var selectDb = _.find(this.state.savedDatabases,(db)=>{
        return db.server === server;
    });
    if(selectDb){
        (React.findDOMNode(this.refs["server-name"]) as any).value = server;
        (React.findDOMNode(this.refs["login"]) as any).value = selectDb.user;
        (React.findDOMNode(this.refs["password"]) as any).value = selectDb.password;
        (React.findDOMNode(this.refs["remember-password"]) as any).checked = selectDb.password;
    }
}

    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="server-name">Server name</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="server-name" placeholder="Server name" ref="server-name"/>
                        <div className="input-group-btn">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-right">
                            {
                                this.state.savedDatabases.map((db)=>{
                                    return (<li><a href="#" onClick={this.selectDb.bind(null, db.server)}>{db.server}</a></li>);
                                })
                            }
                            </ul>
                         </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="login">Login</label>
                    <input type="text" className="form-control" id="login" placeholder="Login" ref="login"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" ref="password"/>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" ref="remember-password"/> Remember password
                    </label>
                </div>
                <button type="button" className="btn btn-default" onClick={this.onConnect}>Connect</button>
            </div>);
    }
}

export = TypedReact.createClass(DbConnector);
