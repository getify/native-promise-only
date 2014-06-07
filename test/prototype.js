/*jslint indent: 8*/
/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";

var assert = require("assert");
require("../lib/npo.src.js");

var helpers = require("./helpers.js");
Object.keys(helpers).map(function (name) { global[name] = helpers[name]; });


describe("ES6 25.4.5 Properties of the Promise Prototype Object", function () {
	it("is an ordinary object");
	it("is not a Promise"); // implied
});

describe("25.4.5.1 Promise.prototype.catch( onRejected )", function () {
	it("is a function");
	it("expects 'this' to be a Promise");
	it("takes one argument, a function");
	it("is equivalent to 'promise.then(undefined, fn)'");
});

describe("25.4.5.2 Promise.prototype.constructor", function () {
	it("is an object");
	it("is the Promise object");
});

describe("25.4.5.3 Promise.prototype.then", function () {
	it("is a function");
	it("expects 'this' to be a Promise");
	it("throws TypeError if 'this' is not a Promise");
	it("takes two arguments, both optional, both functions");
	it("has default on resolve: identity");
	it("has default on reject: thrower", function () {
		var errorObject = {};
		var p = new Promise(function (resolve, reject) { reject(errorObject); });

		// if IsCallable( onRejected ) returns false, then let onRejected be Thrower
		// Thrower is a function which throws its first argument
		// p.then(f) passes 'undefined' as onRejected, so onRejected should
		// default to Thrower, which should throw the argument passed to it from
		// reject
		assert.throws(function () {
			p.then(unexpectedResolve);
		}, function(err) {
			assert.equals(err, errorObject); 
		});
	});

	it("does not call either function immediately if promise status is 'pending'");

	it("does call onFulfilled immediately if promise status is 'fulfilled'");
	it("never calls onRejected if promise status is 'fulfilled'");
	
	it("never calls onFullfilled if promise status is 'rejected'");
	it("does call onRejected immediately if promise status is 'rejected'");

	it("returns its 'this' argument if it is of type 'Promise'");
	it("returns a Promise-wrapped version of 'this' if 'this' is not of type 'Promise'");
});
	
