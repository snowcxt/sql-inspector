global.jQuery = require('jquery');
require('bootstrap');

import React = require("react");
import SqlStatement = require("./SqlStatement");
import Upload = require("./UploadHistory");


React.render(React.createElement(Upload), document.getElementById("upload"));
React.render(React.createElement(SqlStatement), document.getElementById("SqlStatement"));
