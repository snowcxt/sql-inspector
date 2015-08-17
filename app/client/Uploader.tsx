import React = require("react");
import TypedReact = require("typed-react");
import treeBuilder = require("./tree-builder");
import Tree = require("./Tree/index");

class Uploader extends TypedReact.Component<{
    setLogs: (logs: any[]) => void
}, number>{
    render(){
        return (
                <span className="btn btn-default btn-file">
                    <i className="glyphicon glyphicon-open"></i>
                    Open <input type="file" accept=".json" onChange={(e)=>{
                var element:any = e.target;
                if (element.files && element.files.length > 0) {
                    var textFile = element.files[0],
                        reader = new FileReader();
                    reader.readAsText(textFile);
                    reader.onload = () => {
                        this.props.setLogs(JSON.parse(reader.result).log);
                    };
                }
                    }} file-on-change="upload" />
                </span>
        );
    }
}

export = TypedReact.createClass(Uploader);
