import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");

var ipc = require('ipc');

class VersionChecker extends TypedReact.Component<{}, {
    version?: string;
    updateAvailable?: boolean;
}>{
    getInitialState() {
        return {
            version: "",
            updateAvailable: false
        };
    }

    componentDidMount() {
        ipc.on('app-version', (version) => {
            this.setState({
                version: version
            });
        });

        ipc.on('update-available', () => {
            this.setState({
                updateAvailable: true
            });
        });
    }

    render() {
        return this.state.updateAvailable ?
            (<p title="Restart the app to apply the update" className="label label-warning"><i className="glyphicon glyphicon-arrow-up blink"/> v  {this.state.version}</p>) :
            (<p className="label label-default">v {this.state.version}</p>);
    }
}

export = TypedReact.createClass(VersionChecker);
