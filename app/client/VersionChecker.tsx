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
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        this.setState({
            version: getParameterByName("version")
        });

        ipc.on('update-available', () => {
            this.setState({
                updateAvailable: true
            });
        });

        ipc.on('update-error', (error) => {
            if (error) {
                this.setState({
                    error: error.message
                });
            }
        });
    }

    render() {
        if (this.state.error) {
            var errorMessage = "Fail to check the latest version due to: " + this.state.error + "."
            return (<p title={errorMessage} className="label label-warning"><i className="glyphicon glyphicon-warning-sign"/> v  {this.state.version}</p>);
        } else {
            return this.state.updateAvailable ?
                (<p title="Restart the app to apply the update" className="label label-info"><i className="glyphicon glyphicon-arrow-up blink"/> v  {this.state.version}</p>) :
                (<p className="label label-default">v {this.state.version}</p>);
        }
    }
}

export = TypedReact.createClass(VersionChecker);
