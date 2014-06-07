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

    it("can return a resolved promise", function () {
	var p1 = Promise.resolve(3);
	
	p1.then(expectedResolve(3), unexpectedReject);
    });

    it("can return a pending promise", function (done) {
	var p1 = new Promise(resolveImmediately("resolve"));

	var sequencer = [1];

	var p2 = Promise.resolve(p1).then(function (resolved) {
	    assert.equal("resolve", resolved);
	    sequencer.push(3);
	    assert.deepEqual([1,2,3], sequencer);
	    done();
	});

	sequencer.push(2);
    });

    it("can return a rejected promise", function () {
	var p1 = Promise.reject(3);
	var p2 = Promise.resolve(p1);

	p2.then(unexpectedResolve, expectedReject(3));
    });

    it("can pass through a non-promise if passed a non-promise", function () {
	var Base = function () {};
	var notPromise = new Base();

	// TODO(Sam): check spec compliance here (25.4.1.7)
	// IsPromise() requires check for existence of
	// [[PromiseState]] internal slot; not possible in npo
	var p = Promise.resolve.call(Base, notPromise);

	assert.equal(notPromise, p);
    });
});
