"use strict";

var assert = require("assert"),
    path = require("path");
require(path.join(__dirname,"../lib/npo.src.js"));

describe("Promise constructor", function () {
    it("is provided", function () {
	assert.notEqual(Promise,undefined);
	assert.equal(typeof Promise,"function");
    });

    it("returns a new Promise", function () {
	var p = new Promise(function () {});

	assert.ok(p instanceof Promise);
    });
});
