import React = require("react");
import TypedReact = require("typed-react");
import treeBuilder = require("./tree-builder");
import Tree = require("./TreeNode");

class Upload extends TypedReact.Component<any, any>{
    render(){
        return (
                <span className="btn btn-sm btn-default btn-file">
                    <i className="glyphicon glyphicon-open"></i>
                    Upload <input type="file" onChange={(e)=>{
                var element:any = e.target;
                if (element.files && element.files.length > 0) {
                    var textFile = element.files[0],
                        reader = new FileReader();
                    reader.readAsText(textFile);
                    reader.onload = () => {
                        var tree = treeBuilder.build(JSON.parse(reader.result).log);
                        React.render(React.createElement(Tree, { node: tree }), document.getElementById("tree"));
                    };
                }
                    }} file-on-change="upload" />
                </span>
        );
    }
}

export = TypedReact.createClass(Upload);
