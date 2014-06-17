"use strict";

var assert = require("assert");

var helpers = require("./helpers.js");
Object.keys(helpers).map(function (name) { global[name] = helpers[name]; });

describe("25.4.4.5 Promise.resolve( x )", function () {
    it("is a function", function () {
	assert.equal("function", typeof Promise.resolve);
    });
    it("expects one argument", function () {
	assert.equal(1, Promise.resolve.length);
    });
    it("passes through a promise created with the same constructor as 'this'", function () {
	var p1 = new Promise(resolveImmediately(1));
	var p2 = Promise.resolve(p1);

	assert.strictEqual(p1, p2);
    });

    // otherwise (called on value not created by 'this' constructor)
    it("creates a new promise using the supplied constructor", function () {
	var p1 = Promise.resolve(3);

	assert.ok(p1 instanceof Promise);
    });
    it("throws if 'this' is not a constructor", function () {
	var notAConstructor = 3;

	assert.throws(function() {
	    Promise.resolve.call(notAConstructor, 4);
	}, TypeError);
    });

    it("can return a resolved promise", function (done) {
	var p1 = Promise.resolve(3);
	
	p1.then(expectedResolve(3, done), unexpectedReject);
    });

    it("can return a pending promise", function (done) {
	var p1 = new Promise(resolveImmediately("resolve"));

	var sequencer = [1];

	var p2 = Promise.resolve(p1).then(function (resolved) {

	    setImmediate(function () {
		assert.equal("resolve", resolved);
		sequencer.push(3);
		assert.deepEqual([1,2,3], sequencer);
		done();
	    });
	});

	sequencer.push(2);
    });

    it("can return a rejected promise", function (done) {
	var p1 = Promise.reject(3);
	var p2 = Promise.resolve(p1);

	p2.then(unexpectedResolve, expectedReject(3, done));
    });

    // 25.4.4.5 steps 2 a & b:
    // 2. if IsPromise(x) is true
    //   a. Let constructor be the value of x's PromiseConstructor
    //   b. if SameValue(Constructor, C) is true, return x
    it("can pass through a subclassed promise if passed a subclassed promise");
});
