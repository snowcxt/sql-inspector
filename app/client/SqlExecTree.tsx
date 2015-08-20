import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./Tree/index");
import DataGetter = require("./DataGetter");
import treeBuilder = require("./tree-builder");

class SqlExecTree extends TypedReact.Component<{
    isConnected: boolean;
    logs: any[];
}, number>{
    getData(database: string, statement: string) {
        (this.refs["data-getter"] as any).show(database, statement);
    }

    render() {
        var node = treeBuilder.build(this.props.logs);
        return (
            <div>
                <Tree isConnected={this.props.isConnected} node={node} getData={this.getData}></Tree>
                <DataGetter isConnected={this.props.isConnected} ref="data-getter" statement="string"></DataGetter>
            </div>
        )
    }
}

export = TypedReact.createClass(SqlExecTree);
