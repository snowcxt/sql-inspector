/// <reference path="DefinitelyTyped/react.d.ts" />

import React = require("react");
import Timer = require("./timer");
import Tree = require("./TreeNode");
import db = require("../server/database");

React.render(React.createElement(Timer.timer, null), document.getElementById("container"));

var tree = {
    title: "howdy",
    childNodes: [
        {
            title: "bobby",
            title2: "bobby 2"
        }, {
            title: "suzie",
            title2: "bobby 2 123",
            childNodes: [{
                title: "puppy",
                childNodes: [{ title: "dog house" }
                ]
            }, {
                    title: "cherry tree"
                }
            ]
        }
    ]
};

React.render(React.createElement(Tree.TreeNode2, { node: tree }), document.getElementById("tree"));


db.query('select count(1) number from list_productions', function(err, recordset) {
    if (err)
        return console.log(err);

    console.dir(recordset);
    alert(recordset[0].number);
});
