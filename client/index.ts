/// <reference path="react.d.ts" />
/// <reference path="timer.ts" />

import React = require("react");
import  Timer = require("./timer");
import db = require("../server/database");
React.render(React.createElement(Timer.timer, null), document.getElementById("container"));
db.query('select count(1) number from list_productions', function (err, recordset) {
    if (err)
        return console.log(err);

    console.dir(recordset);
    alert(recordset[0].number);
});
