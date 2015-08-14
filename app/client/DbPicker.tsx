import React = require("react");
import TypedReact = require("typed-react");

var Select = require('react-select');

class DbPicker extends TypedReact.Component<{
    setDatabases: (databases: string[]) => void;
    databases: string[];
}, {
        selectValue?: string;
    }>{
    getInitialState() {
        return {
            databases: [],
            selectValue: ""
        };
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
        var db = this.props.databases.map((dbname) => {
            return { value: dbname, label: dbname };
        });
        return (
            <p>
            <Select multi={true} searchable={true} placeholder="Select monior database(s) ..." value={this.state.selectValue} onChange={this.onChange} options={db}></Select>
            </p>);
    }
}

export = TypedReact.createClass(DbPicker);
