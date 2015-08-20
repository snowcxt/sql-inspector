import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./Tree/index");
import DataGetter = require("./DataGetter");
import treeBuilder = require("./tree-builder");

import EventEmitter = require("./EventEmitter");

class SqlExecTree extends TypedReact.Component<{
    logs: any[];
}, {
        isConnected: boolean;
    }>{
    getInitialState() {
        return {
            isConnected: false
        };
    }

    getData(database: string, statement: string) {
        (this.refs["data-getter"] as any).show(database, statement);
    }

    componentDidMount() {
        EventEmitter.addListener("DB_CONNCTED", (databases) => {
            this.setState({ isConnected: databases && databases.length > 0 });
        });
    }

    render() {
        var node = treeBuilder.build(this.props.logs);
        return (
            <div>
                <Tree isConnected={this.state.isConnected} node={node} getData={this.getData}></Tree>
                <DataGetter isConnected={this.state.isConnected} ref="data-getter" statement="string"></DataGetter>
                </div>
        )
    }
}

export = TypedReact.createClass(SqlExecTree);
