/// <reference path="DefinitelyTyped/react.d.ts" />
/// <reference path="../node_modules/typed-react/typed-react.d.ts" />

import React = require("react");
import Addons = require("react/addons");
import TypedReact = require("typed-react");

export var T = React.createClass<any, {
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
                return
                <li key={index}>
                    <T node={node}></T>
                </li>;
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
            React.DOM.div(null,
                React.DOM.h5({
                    onClick: () => {
                        this.setState({ visible: !this.state.visible });
                    }, className: Addons.addons.classSet(classObj)
                }, this.props.node.title),
                React.DOM.p(null, " ", this.props.node.title2, " "),
                React.DOM.ul({ style: style }, childNodes)
            )
        );
    }
});
