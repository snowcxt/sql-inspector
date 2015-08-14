import React = require("react");
import TypedReact = require("typed-react");

import DbHelper = require("../server/DbHelper");

var Select = require('react-select');

class DbConnector extends TypedReact.Component<{
    setConnection: (config: IDbConnection, rememberPassword: boolean) => void
}, number>{
    onConnect() {
        this.props.setConnection({
            server: (React.findDOMNode(this.refs["server-name"]) as any).value.trim(),
            password: (React.findDOMNode(this.refs["password"]) as any).value.trim(),
            user: (React.findDOMNode(this.refs["login"]) as any).value.trim()
        }, (React.findDOMNode(this.refs["remember-password"]) as any).checked);
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="server-name">Server name</label>
                    <input type="text" className="form-control" id="server-name" placeholder="Server name" ref="server-name"/>
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
