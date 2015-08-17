import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./Tree/index");
import DataGetter = require("./DataGetter");
import treeBuilder = require("./tree-builder");

class SqlExecTree extends TypedReact.Component<{
    logs: any[]
}, any>{
    getData(statement: string) {
        (this.refs["data-getter"] as any).show();
    }

    render() {
        var node = treeBuilder.build(this.props.logs);
        return (
            <div>
                <Tree node={node} getData={this.getData}></Tree>
                <DataGetter ref="data-getter" statement="string"></DataGetter>
            </div>
        )
    }
}

export = TypedReact.createClass(SqlExecTree);
