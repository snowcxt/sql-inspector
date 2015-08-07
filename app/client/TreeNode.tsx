import React = require("react");
import Addons = require("react/addons");
import TypedReact = require("typed-react");

class TreeNode extends TypedReact.Component<{ node: ITreeNode }, {
    visible: boolean;
    showDetails:boolean;
}>{
    getInitialState() {
        return {
            visible: true,
            showDetails: false
        };
    }

    toggle(){
        this.setState({ visible: !this.state.visible, showDetails: this.state.showDetails });
    }

    showDetails(e){
        e.stopPropagation();
        this.setState({ visible: this.state.visible, showDetails: !this.state.showDetails });
    }

    getActionColor(prefix:string, row:ILog):string{
        switch (row.action_id.trim()) {
                case "EX":
                    return prefix + "-primary";
                case "UP":
                    return prefix + "-warning";
                case "IN":
                    return prefix + "-success";
                case "DL":
                    return prefix + "-danger";
                case "SL":
                    return prefix + "-default";
                default:
                    return prefix + "-info";
            }
    }

    hasChildren(){
        return this.props.node.nodes && this.props.node.nodes.length > 0;
    }

    render() {
        var childNodes;
        var classObj;
        var node = this.props.node;
        var showDetailsClassObj;
        var detailsStyle

        if (node.nodes != null) {
            childNodes = node.nodes.map(function(node, index) {
                return (
                    <li key={index}>
                        <Node node={node}></Node>
                    </li>
                );
            });

            classObj = {
                togglable: true,
                glyphicon: true,
                "hide-toggle": !(this.props.node.nodes && this.props.node.nodes.length > 0),
                "glyphicon-chevron-down": this.state.visible,
                "glyphicon-chevron-right": !this.state.visible
            };
        }

         showDetailsClassObj = {
            glyphicon: true,
            "glyphicon-chevron-right": !this.state.showDetails,
            "glyphicon-chevron-down": this.state.showDetails
        };

        var style;
        if (!this.state.visible) {
            style = { display: "none" };
        }

        if(!this.state.showDetails){
            detailsStyle = { display: "none" };
        }
        if (this.props.node.log) {
            return (
                <div>
                    <div className={"tree-node panel " + this.getActionColor('panel', node.log)}>
                        <div className={"panel-heading"} onClick={this.toggle}>
                            <a className="text-muted">
                                <span className={Addons.addons.classSet(classObj)}></span>
                            </a>
                            <span className="text-danger" ng-if="!node.failToGetParent">
                                <i className="glyphicon glyphicon-warning-sign"></i>
                            </span>
                            { node.index }
                            <span className="badge">{ node.log.action_id }</span>
                            <span className="badge">{ node.log.database_name }</span>

                            <b>{ node.log.object_name}</b>

                            <a className="btn btn-xs btn-default pull-right" onClick={this.showDetails}>
                                <span className={Addons.addons.classSet(showDetailsClassObj)}></span>
                            </a>
                        </div>
                        <div className="panel-body" style={detailsStyle}>
                            {/* <ui-codemirror ui-codemirror-opts="sqlStatementOptions" ng-model="node.log.statement"></ui-codemirror>*/ }
                            { node.log.statement }
                            <button className="btn btn-default btn-xs pull-right" ng-if="node.log.action_id.trim() === 'SL'" ng-click="showFakeTableModel(node.log)">fake table</button>
                        </div>
                    </div>
                    <ul className="tree-nodes" style={style}>{childNodes}</ul>
                </div>
            );
        } else {
            return (<ul className="tree-nodes" style={style}>{childNodes}</ul>);
        }

    }
}

var Node = TypedReact.createClass(TreeNode);
export = Node;
