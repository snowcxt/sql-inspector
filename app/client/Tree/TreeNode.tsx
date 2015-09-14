import React = require("react");
import TypedReact = require("typed-react");
import ActionDetails = require("./ActionDetails");

var classNames = require('classnames');
var CodeMirror = require('codemirror');

class TreeNode extends TypedReact.Component<{
    isConnected: boolean;
    node: ITreeNode;
    getData: (database: string, statement: string) => void;
    toggle: (visible: boolean) => void;
}, {
        visible?: boolean;
        showDetails?: boolean;
    }>{
    editor: CodeMirror.EditorFromTextArea = null;
    getInitialState() {
        return {
            visible: false,
            showDetails: false
        };
    }

    getActionColor(prefix: string, row: ITreeNode): string {
        switch (row.actions[0].action) {
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

    toggle() {
        this.props.toggle(!this.state.visible);
        this.setState({
            visible: !this.state.visible
        });
    }

    toggleDetails(e) {
        e.stopPropagation();

        this.setState({
            showDetails: !this.state.showDetails
        }, () => {
            if (!this.editor && this.state.showDetails) {
                var mirror = this.refs["codemirror"];
                if (mirror) {
                    this.editor = CodeMirror.fromTextArea(React.findDOMNode(mirror), {
                        viewportMargin: 0,
                        readOnly: true,
                        mode: 'text/x-mssql'
                    });
                }
            }
        });
    }

    getData() {
        this.props.getData(this.props.node.log.database_name, this.props.node.log.statement);
    }

    render() {
        var node = this.props.node;
        var classObj;
        var showDetailsClassObj;

        if (node.nodes != null) {
            classObj = {
                togglable: true,
                glyphicon: true,
                "glyphicon-chevron-down": this.state.visible,
                "glyphicon-chevron-right": !this.state.visible
            };
        }

        showDetailsClassObj = {
            glyphicon: true,
            "glyphicon-chevron-right": !this.state.showDetails,
            "glyphicon-chevron-down": this.state.showDetails
        };

        var detailsStyle;
        if (!this.state.showDetails) {
            detailsStyle = { display: "none" };
        }

        return (
            <div className={"tree-node panel " + this.getActionColor('panel', node) }>
                <div className="panel-heading action-header" onClick={this.toggle}>
                    {
                    node.nodes.length > 0 ? (
                        <span><a className="btn btn-xs btn-link">
                            <span className={classNames(classObj) }></span>
                        </a>{' '}</span>) : null
                    }
                    {
                    this.props.node.getParent ? null : (
                        <span className="text-danger">
                        <i className="glyphicon glyphicon-warning-sign"></i>
                            </span>)
                    }
                    <ActionDetails node={this.props.node}/>

                    <a className="btn btn-xs btn-default pull-right" onClick={this.toggleDetails}>
                        <span className={classNames(showDetailsClassObj) }></span>
                        </a>
                    </div>
                <div className="panel-body" style={detailsStyle}>
                    <textarea ref="codemirror" value={node.log.statement} readOnly={true}></textarea>
                    </div>
                </div>)
    }
}

export = TypedReact.createClass(TreeNode);
