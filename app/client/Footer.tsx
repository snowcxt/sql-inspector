import React = require("react");
import TypedReact = require("typed-react");
import VersionChecker = require("./VersionChecker");
var shell = require('shell');


class Footer extends TypedReact.Component<{}, {}>{
    reportIssue() {
        shell.openExternal('https://github.com/snowcxt/sql-seer/issues/new');
    }
    render() {
        return (<footer>
            <a target="_blank" className="btn btn-xs btn-link" onClick={this.reportIssue}>
                report issue
                </a>
                <div className="pull-right">
                <VersionChecker />
                </div>
            </footer>);
    }
}

export = TypedReact.createClass(Footer);
