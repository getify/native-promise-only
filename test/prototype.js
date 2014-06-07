/*jslint indent: 8*/
/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";

var assert = require("assert");

describe("ES6 25.4.5 Properties of the Promise Prototype Object", function () {
	it("is an ordinary object");
	it("is not a Promise"); // implied

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
		it("is expects 'this' to be a Promise");
		it("throws TypeError if 'this' is not a Promise");
		it("takes two arguments, both optional, both functions");
		it("has default on resolve: identity");
		it("has default on reject: throw");
	});
	
});
