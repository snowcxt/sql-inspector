import React = require("react");
import TypedReact = require("typed-react");

class ActionDetails extends TypedReact.Component<{
    node: ITreeNode
}, {}>{
    translateAction(actionName) {
        switch (actionName) {
            case "EX":
                return "EXEC";
            case "UP":
                return "UPDATE";
            case "IN":
                return "INSERT";
            case "DL":
                return "DELETE";
            case "SL":
                return "SELECT";
            case "CR":
                return "CREATE TABLE";
            case "DR":
                return "DROP TABLE";
            default:
                return actionName;
        }
    }
    render() {
        var node = this.props.node;
        if (node.actionNumber === 1) {
            return (<span>
                <span className="badge">
                {this.translateAction(node.actions[0].action) }
                    </span>{' '}
                <span className="badge">{ node.actions[0].databases[0]}</span>{' '}
                <b>{ node.actions[0].objectNames[0]}</b>
                </span>);
        } else {
            return (<span>
                    {
                    node.actions.map((action) => {
                        return (<span>
                                <span className="badge">{this.translateAction(action.action) }{ action.number > 1 ? " x " + action.number : ""}
                                    </span>{' '}
                            </span>);
                    })
                    }
                </span>);
        }
    }
}

export = TypedReact.createClass(ActionDetails);
