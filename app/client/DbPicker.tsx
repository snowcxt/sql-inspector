import React = require("react");
import TypedReact = require("typed-react");

import DbHelper = require("../server/DbHelper");

var Select = require('react-select');

class DbPicker extends TypedReact.Component<{
    setDatabases: (databases: string[]) => void;
}, { databases: Array<{ value: string; label: string; }> }>{
    getInitialState() {
        return { databases: [] };
    }

    componentDidMount() {
        DbHelper.getDatases((err, databases) => {
            if (err) return console.log(err);
            var options = databases.map((db) => {
                return { value: db, label: db };
            });
            this.setState({
                databases: options
            });
            this.props.setDatabases(databases);
        });
    }

    render() {
        return (
            <p>
            <Select multi={true} searchable={true} placeholder="Select monior database(s) ..." options={this.state.databases}></Select>
            </p>);
    }
}

export = TypedReact.createClass(DbPicker);
