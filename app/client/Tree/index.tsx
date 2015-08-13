import React = require("react");
import TypedReact = require("typed-react");

import TreeNode = require("./TreeNode");

class Tree extends TypedReact.Component<{ node: ITreeNode }, {
    visible?: boolean;
}>{
    getInitialState() {
        return {
            visible: true
        };
    }

    hasChildren() {
        return this.props.node.nodes && this.props.node.nodes.length > 0;
    }

    toggle(visible) {
        this.setState({
            visible: visible
        });
    }
    render() {
        var node = this.props.node;
        var childNodes = [];
        if (node.nodes != null) {
            childNodes = node.nodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <SubTree node={node}></SubTree>
                    </li>
                );
            });
        }

        var toggleStyle;
        if (!this.state.visible) {
            toggleStyle = { display: "none" };
        }

        if (this.props.node.log) {
            return (
                <div>
                    <TreeNode node={node} childNodes={childNodes} toggle={this.toggle}></TreeNode>
                    <ul className="tree-nodes" style={toggleStyle}>{childNodes}</ul>
                </div>
            );
        } else {
            return (<ul className="tree-nodes" style={toggleStyle}>{childNodes}</ul>);
        }

    }
}

var SubTree = TypedReact.createClass(Tree);
export = SubTree;
