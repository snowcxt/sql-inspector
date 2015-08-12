global.jQuery = require('jquery');
require('bootstrap');

import DbHelper = require("../server/DbHelper");
import React = require("react");
import App = require("./App");

React.render(<App></App>, document.getElementById("app"));
