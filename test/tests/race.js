/*jslint indent: 8*/
/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";

var assert = require("assert");

var helpers = require("./helpers.js");
Object.keys(helpers).map(function (name) { global[name] = helpers[name]; });

describe("ES6 25.4.4.3 Promise.race( iterable )", function () {
	it("is a function", function () {
		assert.equal("function", typeof Promise.race);
	});
	it("expects one argument", function () {
		assert.equal(1, Promise.race.length);
	});
	it("should immediately reject for non-iterable argument", function (done) {
		var nonIterable = 3;  

		// non-Object fails CheckIterable per 7.4.1
		// GetIterator throws TypeError per 7.4.2

		Promise.race(nonIterable).then(unexpectedResolve, function (err) {
			assert.ok(err instanceof TypeError);
			done();
		});
	});
	it("requires 'this' to be a constructor function that supports the " +
	   "parameter conventions of the Promise constructor", function (done) {
		var empty = {};
		assert.throws(function () {
			Promise.race.call(empty, []);
		}, TypeError);
		   done();
	});

	it("requires 'this' to provide a 'resolve' method", function (done) {
		var Extended = {};
		
		// NOTE node.js specific feature
		var util = require("util");
		util.inherits(Extended, Promise);
		// END NOTE node.js specific feature
		
		Extended.resolve = 3;
		assert.equal('number', typeof Extended.resolve);
		
		assert.throws(function () {
			Promise.race.call(Extended, []);
		}, TypeError);
		done();
	});
});

describe("Promise.race with 0-element array", function () {
	it("should accept an empty array", function () {
		var p = Promise.race([]);
		assert.ok(p instanceof Promise);
	});
	it("should return a pending promise", function (done) {
		var p = Promise.race([]);
		p.then(unexpectedResolve, unexpectedReject);
		setTimeout(done, 20);
	});
});

describe("Promise.race with 1-element array", function () {
	it("should accept an array of one promise", function (done) {
		var p1 = new Promise(resolveImmediately(1));
		
		Promise.race([p1]).then(expectedResolve(1, done),
					unexpectedReject);
	});
	it("should resolve immediately", function (done) {
		var p1 = new Promise(resolveAfter(10, 1));
		
		Promise.race([p1]).then(expectedResolve(1, done),
					unexpectedReject);
	});
	it("should reject immediately", function (done) {
		var p1 = new Promise(rejectAfter(10, 1));
		
		Promise.race([p1]).then(unexpectedResolve,
					expectedReject(1, done));
	});
});

describe("Promise.race with 2-element array", function () {
	it("should accept an array of two promises", function (done) {
		var p1 = new Promise(resolveAfter(10, 1)),
		    p2 = new Promise(resolveAfter(20, 2));
		
		Promise.race([p1,p2]).then(expectedResolve(1, done),
					   unexpectedReject);
	});
	it("should resolve immediately when first resolves", function (done) {
		var p1 = new Promise(resolveAfter(10, 1)),
		    p2 = new Promise(neverResolve);
		
		Promise.race([p1,p2]).then(expectedResolve(1, done),
					   unexpectedReject);
	});
	it("should resolve immediately when second resolves", function (done) {
		var p1 = new Promise(neverResolve),
		    p2 = new Promise(resolveAfter(10, 2));

		Promise.race([p1,p2]).then(expectedResolve(2, done),
					   unexpectedReject);
	});
	it("should reject immediately when first rejects", function (done) {
		var p1 = new Promise(rejectImmediately(1)),
		    p2 = new Promise(resolveAfter(10, 2));
		
		Promise.race([p1,p2]).then(unexpectedResolve,
					   expectedReject(1, done));
	});
	it("should reject immediately when second rejects", function (done) {
		var p1 = new Promise(resolveAfter(10, 1)),
		    p2 = new Promise(rejectImmediately(2));
		
		Promise.race([p1,p2]).then(unexpectedResolve,
					   expectedReject(2, done));
	});
});

