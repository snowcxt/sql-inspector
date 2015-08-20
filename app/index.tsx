(global as any).jQuery = require('jquery');
require('bootstrap');

import React = require("react");
import App = require("./client/App");
React.render(<App></App>, document.getElementById("app"));
