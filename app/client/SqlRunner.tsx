import React = require("react");
import TypedReact = require("typed-react");

import EventEmitter = require("./EventEmitter");
import DbPicker = require("./DbPicker");
import DbMonitor = require("./DbMonitor");
import StatementRunner = require("./StatementRunner");

class SqlRunner extends TypedReact.Component<{
    ref: string;
    statement: string;
}, {
        databases?: string[];
        monioredDatabases?: string[];
    }>{
    getStatement(): string {
        return (this.refs["sql-runner"] as any).getStatement();
    }

    getInitialState() {
        return {
            databases: [],
            monioredDatabases: []
        };
    }

    componentDidMount() {
        EventEmitter.Emitter.addListener(EventEmitter.Types.DB_CONNCTED, (databases) => {
            this.setState({ databases: databases });
        });
    }

    setDatabases(databases: string[]) {
        this.setState({
            monioredDatabases: databases
        });
    }

    render() {
        return this.state.databases && this.state.databases.length > 0 ? (
            <div>
                <DbPicker databases={this.state.databases} setDatabases={this.setDatabases} />
                <DbMonitor monioredDatabases={this.state.monioredDatabases}/>
                <StatementRunner ref="sql-runner" statement={this.props.statement} monioredDatabases={this.state.monioredDatabases} />
                </div>) : null;
    }
}

export = TypedReact.createClass(SqlRunner);
