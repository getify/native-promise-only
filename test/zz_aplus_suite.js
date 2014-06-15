"use strict";

var assert = require("assert");

// force load of source, to check coverage
var adapter = require("../test_adapter.js")('/lib/npo.src.js');

describe("static helper unit tests", function () {
	assert.ok(true);
});

describe("Promises/A+ Tests", function () {
	require("promises-aplus-tests").mocha(adapter);
});
