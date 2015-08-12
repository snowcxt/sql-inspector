import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");

import DbHelper = require("../server/DbHelper");

var multiselect = require("bootstrap-multiselect");

class DbPicker extends TypedReact.Component<{
    setDatabases: (databases: string[]) => void;
}, {
    databases: string[]
}>{
    getInitialState() {
        return { databases: [] };
    }

    componentDidMount() {
        var dropdown: any = $(React.findDOMNode(this.refs["db-dropdown"]));
        dropdown.hide();
        DbHelper.getDatases((err, databases) => {
            if (err) return console.log(err);
            this.setState({
                databases: databases
            });
            this.props.setDatabases(databases);
            dropdown.show();
            dropdown.multiselect();
        });
    }

    render() {
        return (
            <p>
                <select ref="db-dropdown" multiple={true}>
                {
                this.state.databases.map((db) => {
                    return (<option key={db} value={db}>{db}</option>);
                })
                }
                </select>
            </p>);
    }
}

export = TypedReact.createClass(DbPicker);
