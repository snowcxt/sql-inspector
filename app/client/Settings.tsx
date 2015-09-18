import React = require("react");
import TypedReact = require("typed-react");
import settings = require("../server/Settings");
import $ = require("jquery");
var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');
//require('codemirror/mode/sql/sql');

class Settings extends TypedReact.Component<{}, {}>{
    private editor: CodeMirror.EditorFromTextArea = null;

    componentDidMount() {
        $('#settings-model').on('shown.bs.modal', (e) => {
            settings.getSettings((err, setting) => {
                if(!this.editor) {
                    var mirror: any = React.findDOMNode(this.refs["settings-text"]);
                    mirror.value = JSON.stringify(setting, null, '\t');
                    this.editor = CodeMirror.fromTextArea(mirror, {
                        autofocus: true,
                        mode: "application/json"
                    });

                 } else {
                     this.editor.getDoc().setValue(JSON.stringify(setting, null, '\t'));
                 }
            });
        });
    }

    onSaveClick() {
        settings.setSettings($.parseJSON(this.editor.getDoc().getValue()), ()=>{
            $('#settings-model').modal('hide');
        });
    }

    render() {
        return (<div><button className="btn btn-link" title="settings" data-toggle="modal" data-target="#settings-model"><i className="glyphicon glyphicon-cog"/></button>
            <div id="settings-model" className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                            <h4 className="modal-title" id="myModalLabel">Settings</h4>
                        </div>
                        <div className="modal-body">
                            <div className="thumbnail">
                                <textarea ref="settings-text"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.onSaveClick}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>);
    }
}

export = TypedReact.createClass(Settings);
