"use strict";

var assert = require("assert"),
    path = require("path");
require(path.join(__dirname,"../lib/npo.src.js"));

describe("Promise constructor", function () {
    it("is provided", function () {
	assert.equal(typeof Promise,"function");
    });

    it("returns a new Promise", function () {
	var p = new Promise(function () {});

	assert.ok(p instanceof Promise);
    });
    
    describe("per ES6 draft", function () {
	describe("25.4.4 Properties of the Promise Constructor", function () {
	    it("has a length property whose value is 1", function () {
		assert.equal(1, Promise.length);
	    });
	});
    });
});
