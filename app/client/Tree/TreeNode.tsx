import React = require("react");
import TypedReact = require("typed-react");

var classNames = require('classnames');

var CodeMirror = require('codemirror');

class TreeNode extends TypedReact.Component<{
    node: ITreeNode;
    toggle: (visible: boolean) => void;
}, {
        visible?: boolean;
        showDetails?: boolean;
    }>{
    editor: CodeMirror.EditorFromTextArea = null;
    getInitialState() {
        return {
            visible: true,
            showDetails: false
        };
    }

    getActionColor(prefix: string, row: ILog): string {
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

        var toggleStyle;
        if (!this.state.visible) {
            toggleStyle = { display: "none" };
        }

        var detailsStyle;
        if (!this.state.showDetails) {
            detailsStyle = { display: "none" };
        }

        return (
            <div className={"tree-node panel " + this.getActionColor('panel', node.log) }>
                <div className={"panel-heading"} onClick={this.toggle}>
                    {
                    node.nodes.length > 0 ? (
                        <a className="text-muted">
                            <span className={classNames(classObj) }></span>{' '}
                        </a>) : null
                    }
                    {
                    this.props.node.getParent ? null : (
                        <span className="text-danger">
                        <i className="glyphicon glyphicon-warning-sign"></i>
                        </span>)
                    }
                    { node.index }{' '}
                    <span className="badge">{ node.log.action_id }</span>{' '}
                    <span className="badge">{ node.log.database_name }</span>{' '}

                    <b>{ node.log.object_name}</b>{' '}

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
