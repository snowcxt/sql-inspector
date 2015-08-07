/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../node_modules/typed-react/typed-react.d.ts" />

import React = require("react");
import Addons = require("react/addons");
import TypedReact = require("typed-react");

export var TreeNode = React.createClass<any, {
    visible: boolean;
}>({
    getInitialState: function() {
        return {
            visible: true
        };
    },

    render: function() {
        var childNodes;
        var classObj;

        if (this.props.node.childNodes != null) {
            childNodes = this.props.node.childNodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <TreeNode node={node}></TreeNode>
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

        return (
            <div>
                <h5 onClick={() => {
                    this.setState({ visible: !this.state.visible });
                }} className={Addons.addons.classSet(classObj)}>
                    {this.props.node.title}
                </h5>
                <p>{this.props.node.title2}</p>
                <ul style={style}>{childNodes}</ul>
            </div>
        );
    }
});
