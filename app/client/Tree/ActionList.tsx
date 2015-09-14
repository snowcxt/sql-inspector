import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");
import _ = require("lodash");
var table = _.template('<table class="table table-condensed"><%= trs %></table>');
var li = _.template("<tr><td><span class='label label-default'><%= database %></span></td><td class='text-primary'><%= objectName %></td></tr>");

//var table = _.template('<ul><%= trs %></ul>');
//var li = _.template('<li><%= database %> <%= objectName %></li>');
class ActionList extends TypedReact.Component<{
    action: IAction,
    translateAction:(action:string)=>string;
}, {}>{
    componentDidMount() {
        $('[data-toggle="popover"]').popover()
    }

    getTemplate(){
        var lis = "";
         this.props.action.details.forEach((detail)=>{
            lis += li({database: detail.database,
            objectName: detail.objectName});
         });

        return table({trs: lis});
    }

    render(){
        var action = this.props.action;

        return (<span className="badge" data-content={this.getTemplate()} data-trigger="click" data-html="true" data-toggle="popover" data-placement="right">{this.props.translateAction(action.action) }{ action.number > 1 ? " x " + action.number : "" }
            </span>);
    }
}

export = TypedReact.createClass(ActionList);
