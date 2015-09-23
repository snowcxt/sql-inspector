import React = require("react");
import TypedReact = require("typed-react");

import Tree = require("./Tree/Tree");
import DataGetter = require("./DataGetter");
import treeBuilder = require("./tree-builder");

import EventEmitter = require("./EventEmitter");

class SqlExecTree extends TypedReact.Component<{}, {
    isConnected?: boolean;
    node?: ITreeNode;
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
        EventEmitter.Emitter.addListener(EventEmitter.Types.DB_CONNCTED, (db) => {
            var databases = db.databases;
            this.setState({ isConnected: databases && databases.length > 0 });
        });

        EventEmitter.Emitter.addListener(EventEmitter.Types.LOG_CHANGED, (logs) => {
            this.setState({ node: treeBuilder.build(logs) });
        });
    }

    render() {
        return (
            <div>
                <Tree isConnected={this.state.isConnected} node={this.state.node} getData={this.getData} />
                <DataGetter ref="data-getter" statement="string" />
                </div>
        )
    }
}

export = TypedReact.createClass(SqlExecTree);
