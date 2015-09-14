(global as any).jQuery = require('jquery');
require('bootstrap');
var ipc = require('ipc');

import React = require("react");
import App = require("./client/App");
React.render(<App />, document.getElementById("app"));

ipc.on('update-available', function () {
    alert('there is an update available for download')
});
