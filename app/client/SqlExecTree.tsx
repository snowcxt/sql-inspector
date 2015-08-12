import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./Tree");
import treeBuilder = require("./tree-builder");

class SqlExecTree extends TypedReact.Component<{
    logs: any[]
}, any>{
    render() {
        var node = treeBuilder.build(this.props.logs);
        return (
            <Tree node={node}></Tree>
        )
    }
}


export = TypedReact.createClass(SqlExecTree);
