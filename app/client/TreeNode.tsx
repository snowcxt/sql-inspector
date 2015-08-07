import React = require("react");
import Addons = require("react/addons");
import TypedReact = require("typed-react");

class TreeNode extends TypedReact.Component<{ node: ITreeNode }, {
    visible: boolean;
}>{
    getInitialState() {
        return {
            visible: true
        };
    }
    render() {
        var childNodes;
        var classObj;

        if (this.props.node.nodes != null) {
            childNodes = this.props.node.nodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <Node node={node}></Node>
                    </li>
                );
            });

            classObj = {
                togglable: true,
                "togglable-down": this.state.visible,
                "togglable-up": !this.state.visible
            };
        }

        var style;
        if (!this.state.visible) {
            style = { display: "none" };
        }
        if (this.props.node.log) {
            return (
                <div>
                    <h5 onClick={() => {
                        this.setState({ visible: !this.state.visible });
                    } } className={Addons.addons.classSet(classObj) }>
                        { this.props.node.log.object_name }
                    </h5>

                    <ul style={style}>{childNodes}</ul>
                </div>
            );
        } else {
            return (<ul style={style}>{childNodes}</ul>);
        }

    }
}

var Node = TypedReact.createClass(TreeNode);
export = Node;
