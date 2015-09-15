import React = require("react");
import TypedReact = require("typed-react");
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

        ipc.on('update-available', function() {
            this.setState({
                updateAvailable: true
            });
        });
    }

    render() {
        return this.state.updateAvailable ?
            (<p className="text-primary"><i className="glyphicon glyphicon-refresh"></i>{' '}<b>Restart the app to apply the update</b></p>) :
            (<p className="label label-default">v 0.0.2{this.state.version}</p>);
    }
}

export = TypedReact.createClass(VersionChecker);
