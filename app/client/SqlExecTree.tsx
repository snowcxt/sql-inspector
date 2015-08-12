import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./TreeNode");
import treeBuilder = require("./tree-builder");

class SqlExecTree extends TypedReact.Component<{
    logs: any[]
}, any>{
    render() {
        var node = treeBuilder.build(this.props.logs);
        return (
            <div className="well">
            <Tree node={node}></Tree>
            </div>
        )
    }
}


export = TypedReact.createClass(SqlExecTree);
