import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");
import DbHelper = require("../server/DbHelper");
var multiselect = require("bootstrap-multiselect");


class DbPicker extends TypedReact.Component<any, {
    databases: string[]
}>{
    getInitialState() {
        return { databases: [] };
    }

    componentDidMount() {
        var defaultDbDom: any = $(React.findDOMNode(this.refs["defaultDb"]));
        var otherDbDom: any = $(React.findDOMNode(this.refs["otherDb"]));
        defaultDbDom.hide();
        otherDbDom.hide();

        DbHelper.getDatases((err, databases) => {
            if (err) return console.log(err);
            this.setState({
                databases: databases
            });
            defaultDbDom.show();
            otherDbDom.show();

            defaultDbDom.multiselect();


        });
    }

    render() {
        return (
            <div>
            <select ref="defaultDb" multiple={false}>
            {
            this.state.databases.map((db) => {
                return (<option value={db}>{db}</option>);
            })
            }
            </select>
            <select ref="otherDb" multiple={true}>
            {
            this.state.databases.map((db) => {
                return (<option value={db}>{db}</option>);
            })
            }
            </select>
        </div>);
    }
}

export = TypedReact.createClass(DbPicker);
