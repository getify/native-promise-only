"use strict";

var adapter = require("./test_adapter.js");

describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha(adapter);
});

describe("ES6 Promises Tests", function () {
    require("promises-es6-tests").mocha(adapter);
});
