import React = require("react");
import TypedReact = require("typed-react");
var ipc = require('ipc');

class VersionChecker extends TypedReact.Component<{}, {
    version: string;
}>{
    getInitialState() {
        return {
            version: ""
        };
    }

    componentDidMount() {
        ipc.on('app-version', (version) => {
            this.setState({
                version: version
            });
        });
    }

    render() {
        return (<span className="text-mute">{this.state.version}</span>);
    }
}

export = TypedReact.createClass(VersionChecker);
