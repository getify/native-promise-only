"use strict";

var assert = require("assert");

describe("static helper unit tests", function() {
	assert.ok(true);
});

describe("Promises/A+ Tests", function() {
	require("promises-aplus-tests").mocha(adapter);
});
