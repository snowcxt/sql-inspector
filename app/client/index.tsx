global.jQuery = require('jquery');
require('bootstrap');

import React = require("react");
import Tree = require("./TreeNode");
import db = require("../server/database");
import treeBuilder = require("./tree-builder");
var FileInput = require('react-file-input');

var Form = React.createClass<any, any>({
    render: function() {
        return (
            <form>
                <FileInput name="json"
                accept=".json"
                placeholder="My Image"
                className="btn btn-file btn-primary"
                onChange={(e) => {
                    // console.log(file, 'selected!');
                    var element = e.target;
                    if (element.files && element.files.length > 0) {
                        var textFile = element.files[0],
                            reader = new FileReader();
                        reader.readAsText(textFile);
                        reader.onload = () => {
                            var tree = treeBuilder.build(JSON.parse(reader.result).log);
                            React.render(React.createElement(Tree, { node: tree }), document.getElementById("tree"));
                        };
                    }
                } } />
            </form>
        );
    },
});

React.render(React.createElement(Form), document.getElementById("file"));

// React.render(React.createElement(Tree, { node: tree }), document.getElementById("tree"));

db.exec('longford', 'select count(1) number from list_productions', function(err, recordset) {
    if (err)
        return console.log(err);

    console.dir(recordset);
    // alert(recordset[0].number);
});
