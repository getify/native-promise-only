/*jslint indent: 8*/
/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";


describe("25.4.4.3 Promise.race( iterable )", function() {
	it("is a function", function() {
		assert.equal("function", typeof Promise.race);
	});
	it("expects one argument", function() {
		assert.equal(1, Promise.race.length);
	});
	it("should immediately reject for non-iterable argument", function(done) {
		var nonIterable = 3;

		// non-Object fails CheckIterable per 7.4.1
		// GetIterator throws TypeError per 7.4.2

		Promise.race(nonIterable)
			.catch(function(rejected) {
				assert.ok(rejected instanceof TypeError);
			}).then(done).catch(done);
	});
	it("requires 'this' to be a constructor function that supports the " +
		"parameter conventions of the Promise constructor", function(done) {
			var empty = {};
			assert.throws(function() {
				Promise.race.call(empty, []);
			}, TypeError);
			done();
		});

	it("requires 'this' to provide a 'resolve' method");

	// eventually: test of subclassing:
	// var Extended = {};
	//
	// Extended.resolve = 3;
	// assert.equal('number', typeof Extended.resolve);
	// 
	// assert.throws(function () {
	// Promise.race.call(Extended, []);
	// }, TypeError);
	// done();
});

describe("25.4.4.3 Promise.race with 0-element array", function() {
	it("should accept an empty array", function() {
		var p = Promise.race([]);
		assert.ok(p instanceof Promise);
	});
	it("should return a pending promise", function(done) {
		var p1 = Promise.race([]);

		p1.then(function() {
			throw new Error("expected Promise.race([]) to remain unsettled");
		})
			.catch(done);

		var p2 = Promise.resolve().then(done).catch(done);
	});
});

describe("25.4.4.3 Promise.race with 1-element array", function() {
	it("should accept an array of one promise", function(done) {
		var p1 = Promise.resolve(1);

		Promise.race([p1]).then(function(resolved) {
			assert.equal(1, resolved);
		}).then(done).catch(done);
	});
	it("should reject immediately", function(done) {
		var p1 = new Promise(function(resolve, reject) {
			reject(1);
		});

		Promise.race([p1]).then(function(resolved) {
			throw new Error("unexpected resolve");
		}, function(rejected) {
			assert.equal(1, rejected);
		}).then(done).catch(done);
	});
});

describe("25.4.4.3 Promise.race with 2-element array", function() {
	it("should accept an array of two promises", function(done) {
		var p1 = Promise.resolve(1),
			p2 = Promise.resolve(2);

		Promise.race([p1, p2]).then(function(resolved) {
			assert.equal(1, resolved);
		}).then(done).catch(done);

	});
	it("should resolve immediately when first resolves", function(done) {
		var p1 = Promise.resolve(1),
			p2 = new Promise(function() {});

		Promise.race([p1, p2]).then(function(resolved) {
			assert.equal(1, resolved);
		}).then(done).catch(done);
	});
	it("should resolve immediately when second resolves", function(done) {
		var p1 = new Promise(function() {}),
			p2 = Promise.resolve(2);

		Promise.race([p1, p2]).then(function(resolved) {
			assert.equal(2, resolved);
		}).then(done).catch(done);
	});
	it("should reject immediately when first rejects", function(done) {
		var p1 = Promise.reject(1),
			p2 = Promise.resolve(2);

		Promise.race([p1, p2]).then(function(resolved) {
			throw new Error("Unexpected resolve");
		}, function(rejected) {
			assert.equal(rejected, 1);
		}).then(done).catch(done);

	});

	it("should fulfill immediately with first fulfilled promise in array", function(done) {
		var resolveP1, rejectP2,
			p1 = new Promise(function(resolve, reject) {
				resolveP1 = resolve;
			}),
			p2 = new Promise(function(resolve, reject) {
				rejectP2 = reject;
			});

		rejectP2(2);
		resolveP1(1);

		Promise.race([p1, p2]).then(function(resolved) {
			assert.equal(resolved, 1);
		}).then(done).catch(done);
	});

	it("should reject immediately when second rejects", function(done) {
		var resolveP1, rejectP2,
			p1 = new Promise(function(resolve, reject) {
				resolveP1 = resolve;
			}),
			p2 = new Promise(function(resolve, reject) {
				rejectP2 = reject;
			});

		Promise.race([p1, p2]).then(function(resolved) {
			throw new Error("Unexpected resolve " + resolved);
		}, function(rejected) {
			assert.equal(rejected, 2);
		}).then(done).catch(done);

		rejectP2(2);
		resolveP1(1);
	});
});
