import React = require("react");
import TypedReact = require("typed-react");

import DbHelper = require("../../server/DbHelper");

var Select = require('react-select');

class DbPicker extends TypedReact.Component<{
    setDatabases: (databases: string[]) => void;
}, {
        databases?: Array<{ value: string; label: string; }>;
        selectValue?: string
    }>{
    getInitialState() {
        return {
            databases: [],
            selectValue: ""
        };
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
        });
    }

    onChange(newValue: string) {
        this.setState({ selectValue: newValue });
        if (newValue) {
            this.props.setDatabases(newValue.split(","));
        } else {
            this.props.setDatabases([]);
        }
    }

    render() {
        return (
            <p>
            <Select multi={true} searchable={true} placeholder="Select monior database(s) ..." value={this.state.selectValue} onChange={this.onChange} options={this.state.databases}></Select>
            </p>);
    }
}

export = TypedReact.createClass(DbPicker);
