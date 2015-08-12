import React = require("react");
import TypedReact = require("typed-react");

var classNames = require('classnames');

var CodeMirror = require('codemirror');
require('codemirror/mode/sql/sql');

class Tree extends TypedReact.Component<{ node: ITreeNode }, {
    visible: boolean;
    showDetails:boolean;
}>{
    getInitialState() {
        return {
            visible: true,
            showDetails: true
        };
    }

    componentDidMount () {
        var mirror:any = this.refs["codemirror"];
        if(mirror) {
            CodeMirror.fromTextArea(mirror.getDOMNode(), {
                viewportMargin: 0,
                readOnly: true,
                mode: 'text/x-mssql'
            });
        }
    		// this.codeMirror.on('change', this.codemirrorValueChanged);
    		// this.codeMirror.on('focus', this.focusChanged.bind(this, true));
    		// this.codeMirror.on('blur', this.focusChanged.bind(this, false));
    		// this._currentCodemirrorValue = this.props.value;
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
                                <span className={classNames(classObj)}></span>
                            </a>
                            <span className="text-danger" ng-if="!node.failToGetParent">
                                <i className="glyphicon glyphicon-warning-sign"></i>
                            </span>
                            { node.index }
                            <span className="badge">{ node.log.action_id }</span>
                            <span className="badge">{ node.log.database_name }</span>

                            <b>{ node.log.object_name}</b>

                            <a className="btn btn-xs btn-default pull-right" onClick={this.showDetails}>
                                <span className={classNames(showDetailsClassObj)}></span>
                            </a>
                        </div>
                        <div className="panel-body" style={detailsStyle}>
                            <textarea ref="codemirror" value={node.log.statement} readOnly={true}></textarea>
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

var Node = TypedReact.createClass(Tree);
export = Node;
