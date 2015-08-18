import React = require("react");
import TypedReact = require("typed-react");
import DbHelper = require("../server/DbHelper");
import $ = require("jquery");
var CodeMirror = require('codemirror');

class DataGetter extends TypedReact.Component<{
    isConnected: boolean;
    statement: string;
    ref: string;
}, {
    insertStatement:string;
}>{
    currentDatabase: string;
    currentStatement: string;
    editor: CodeMirror.EditorFromTextArea = null;

    getInitialState(){
        return {
            insertStatement:""
        }
    }

    componentDidMount(){
        var mirror = this.refs["codemirror"];
        this.editor = CodeMirror.fromTextArea(React.findDOMNode(mirror), {
            viewportMargin: 0,
            readOnly: true,
            mode: 'text/x-mssql'
        });

        $('#data-getter').on('shown.bs.modal',  ()=> {
            this.editor.getDoc().setValue(this.currentStatement);
        });
    }

    show(database: string, statement: string){
        this.currentDatabase = database;
        this.currentStatement = statement;
        ($('#data-getter') as any).modal('show')
    }

    getData(){
        if(this.props.isConnected){
            DbHelper.getTableData(this.currentDatabase, this.currentStatement, (err, result)=>{
                this.setState({insertStatement: result});
            });
        }
    }

    render(){
        return (
            <div className="modal fade" id="data-getter">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" dangerouslySetInnerHTML={{__html: '&times;'}}></span>
                            </button>
                            <h4 className="modal-title">Get data</h4>
                        </div>
                    <div className="modal-body">
                    <textarea ref="codemirror"></textarea>
                    <div className="form-group">
                        <button className="btn btn-default" onClick={this.getData}>get data</button>
                    </div>

                    <div className="form-group">
                        <textarea className="form-control" value={this.state.insertStatement} readOnly={true}></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>);
    }
}

export = TypedReact.createClass(DataGetter);
