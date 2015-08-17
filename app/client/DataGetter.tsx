import React = require("react");
import TypedReact = require("typed-react");
import $ = require("jquery");

class DataGetter extends TypedReact.Component<{
    statement: string;
    ref: string;
}, any>{
    show(){
        ($('#data-getter') as any).modal('show')
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
                    <textarea id="code" name="code"></textarea>
                    <div className="form-group">
                        <button className="btn btn-default" ng-click="getFakeTable()">get data</button>
                    </div>

                    <div className="form-group">
                        <textarea className="form-control" ng-model="fakeTable" readOnly={true}></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>);
    }
}

export = TypedReact.createClass(DataGetter);
