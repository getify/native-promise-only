"use strict";

var assert = require("assert");

var helpers = require("./helpers.js");
Object.keys(helpers).map(function (name) { global[name] = helpers[name]; });

describe("25.4.4.4 Promise.reject( x )", function () {
    it("is a function", function () {
	assert.equal("function", typeof Promise.reject);
    });
    it("expects one argument", function () {
	assert.equal(1, Promise.reject.length);
    });
    it("always creates a new promise using 'this' as constructor", function () {
	var p = Promise.reject(3);

	assert.ok(p instanceof Promise);
    });
    it("throws if 'this' is not a constructor", function () {
	var notAConstructor = 3;

	assert.throws(function () {
	    Promise.reject.call(notAConstructor, 4);
	}, TypeError);
    });
    it("always returns a rejected promise", function () {
	var p = Promise.reject(3);
	p.then(unexpectedResolve, expectedReject(3));
    });
});
