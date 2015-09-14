import React = require("react");
import TypedReact = require("typed-react");
import treeBuilder = require("./tree-builder");

import EventEmitter = require("./EventEmitter");

class Uploader extends TypedReact.Component<{
    onUploaded: (logs: any[], query: string) => void
}, void>{
    onChange(e) {
        var element = e.target;
        if (element.files && element.files.length > 0) {
            var textFile = element.files[0],
                reader = new FileReader();
            reader.readAsText(textFile);
            reader.onload = () => {
                var record = JSON.parse(reader.result);
                EventEmitter.Emitter.emit(EventEmitter.Types.LOG_CHANGED, record.log);
                this.props.onUploaded(record.log, record.query);
            };
        }
    }

    render() {
        return (
            <span className="btn btn-default btn-file">
                    <i className="glyphicon glyphicon-open"></i>{" "}
                    Open <input type="file" accept=".json" onChange={this.onChange} />
                </span>
        );
    }
}

export = TypedReact.createClass(Uploader);
