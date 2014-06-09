/*jslint indent: 8*/
/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";

var assert = require("assert");

var helpers = require("./helpers.js");
Object.keys(helpers).map(function (name) { global[name] = helpers[name]; });

// behavior from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Static_methods
// https://people.mozilla.org/~jorendorff/es6-draft.html
// http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
// Draft rev 25, May 22 2014
// retrieved Jun 07 2014


describe("25.4.4.1 Promise.all( iterable )", function () {
	it("is a function", function () {
		assert.equal("function", typeof Promise.all);
	});
	it("has a length property whose value is 1", function () {
		assert.equal(1, Promise.all.length);
	});
	it("throws if 'this' is not a Promise constructor", function () {
	    // requires the 'this' value to be a constructor function that suppports the
	    // parameter conventions of the Promise constructor
		   var empty = {};

		   assert.throws(function () { 
			   Promise.all.call(empty, []); 
		   }, TypeError);
		   // spec says to throw TypeError, per 25.4.1.6 NewPromiseCapability
	});

	it("should immediately reject for non-iterable argument", function (done) {
		var nonIterable = 3;

		// non-Object fails CheckIterable per 7.4.1
		// GetIterator throws TypeError per 7.4.2
		
		Promise.all(nonIterable)
		.then(unexpectedResolve,
		      expectedRejectFunc(function (err) {
			  assert.ok(err instanceof TypeError);
		      }, done));
	});
});

// 0 elements
describe("25.4.4.1 Promise.all with 0-element array", function () {

	it("should accept an empty array", function () {
		var p = Promise.all([]);
		assert.ok(p instanceof Promise);
	});

	it("should return a resolved promise whose result is empty array", function (done) {
		var p = Promise.all([]);
		assert.ok(p instanceof Promise);
		p.then(expectedResolveDeep([], done),
		       unexpectedReject);
	});
});

// 1 element
describe("25.4.4.1 Promise.all with 1-element array", function () {

	it("should accept an array of one promise", function (done) {
		var p1 = new Promise(resolveImmediately(1));
		
		Promise.all([p1]).then(expectedResolve(1, done), 
				       unexpectedReject);
	});
	it("should resolve immediately", function (done) {
		var obj = {};
		
		var p1 = new Promise(resolveAfter(10, obj));
		
		Promise.all([p1]).then(expectedResolveDeep([obj], done),
				       unexpectedReject);
	});
	it("should reject immediately", function (done) {
		var obj = {};
			
		var p1 = new Promise(rejectImmediately(obj));
		
		Promise.all([p1]).then(unexpectedResolve, 
				       expectedReject(obj, done));
	});
});
	
// 2 elements
describe("25.4.4.1 with 2-element array", function () {
	it("should accept an array of two promises", function (done) {
		var p1 = new Promise(resolveImmediately(1)),
		    p2 = new Promise(resolveImmediately(2));
		
		Promise.all([p1, p2]).then(expectedResolveDeep([1, 2], done),
					   unexpectedReject);
		
	});

	it("should not resolve immediately when one of a two-promise array resolves", function (done) {
		var p1 = new Promise(resolveAfter(10, 1)),
		    p2 = new Promise(resolveAfter(20, 2));
		
		var allResolved = false;

		p1.then(function (resolved) {
		    setImmediate(function () {
			assert.equal(resolved, 1);
			assert.equal(allResolved, false);
		    });
		});

		Promise.all([p1, p2]).then(function (resolved) {
			allResolved = true;
		}, unexpectedReject);

		p2.then(function (resolved) {
		    setImmediate(function () {
			assert.equal(resolved, 2);
			assert.equal(allResolved, true);
			done();
		    });
		});
	});
	// covered by case above
	//	it("should resolve after both promises of a two-promise array resolve");

	it("should reject immediately when the first member of a two-promise array rejects", function (done) {
		var p1 = new Promise(rejectAfter(10, 1)),
		    p2 = new Promise(resolveAfter(20, 2));
		
		Promise.all([p1, p2])
		.then(unexpectedResolve,
		      expectedReject(1, done));
	});

	it("should reject immediately when the second member of a two-promise array rejects", function (done) {
		var p1 = new Promise(resolveAfter(10, 1)),
		    p2 = new Promise(rejectAfter(20, 2));
		
		Promise.all([p1, p2])
		.then(unexpectedResolve,
		      expectedReject(2, done));
	});
});

// not explicitly addressed: 25.4.4.1.1 Promise.all Resolve Element Functions
// these are not visible from userland js
