import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");

var ipc = require('ipc');

class VersionChecker extends TypedReact.Component<{}, {
    version?: string;
    updateAvailable?: boolean;
    error?: string;
}>{
    getInitialState() {
        return {
            version: "",
            updateAvailable: false,
            error: ""
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

        ipc.on('update-error', (error) => {
            this.setState({
                error: error.message
            });
        });
    }

    render() {
        if (this.state.error) {
            var errorMessage = "Fail to get the latest version due to: " + this.state.error + ". You could download the installer manully."
            return (<p title={errorMessage} className="label label-danger"><i className="glyphicon glyphicon-warning-sign"/> v  {this.state.version}</p>);
        } else {
            return this.state.updateAvailable ?
                (<p title="Restart the app to apply the update" className="label label-warning"><i className="glyphicon glyphicon-arrow-up blink"/> v  {this.state.version}</p>) :
                (<p className="label label-default">v {this.state.version}</p>);
        }
    }
}

export = TypedReact.createClass(VersionChecker);
