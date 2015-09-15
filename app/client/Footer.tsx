import React = require("react");
import TypedReact = require("typed-react");
var shell = require('shell');


class Footer extends TypedReact.Component<{}, {}>{
    reportIssue() {
        shell.openExternal('https://github.com/snowcxt/sql-seer/issues/new');
    }
    render() {
        return (<div>
            <a target="_blank" onClick={this.reportIssue}>
                report issue
                </a>
            </div>);
    }
}

export = TypedReact.createClass(Footer);
