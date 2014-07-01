/*global Promise, require, setImmediate, setTimeout, describe, it */
"use strict";


function unexpectedResolve(done) {
	return function() {
		done("Error: promise was expected to not resolve, but did.");
	};
}


// behavior from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Static_methods
// https://people.mozilla.org/~jorendorff/es6-draft.html
// http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
// Draft rev 25, May 22 2014
// retrieved Jun 07 2014




describe("25.4.4.1 Promise.all( iterable )", function() {
	it("is a function", function() {
		assert.equal("function", typeof Promise.all);
	});
	it("has a length property whose value is 1", function() {
		assert.equal(1, Promise.all.length);
	});
	it("throws if 'this' is not a Promise constructor", function() {
		// requires the 'this' value to be a constructor function that suppports the
		// parameter conventions of the Promise constructor
		var empty = {};

		assert.throws(function() {
			Promise.all.call(empty, []);
		}, TypeError);
		// spec says to throw TypeError, per 25.4.1.6 NewPromiseCapability
	});

	it("should immediately reject for non-iterable argument", function(done) {
		var nonIterable = 3;

		// non-Object fails CheckIterable per 7.4.1
		// GetIterator throws TypeError per 7.4.2

		Promise.all(nonIterable)
			.then(unexpectedResolve(done))
			.catch(function(err) {
				assert.ok(err instanceof TypeError);
			}).then(done).catch(done);
	});
});

// 0 elements
describe("25.4.4.1 Promise.all with 0-element array", function() {

	it("should accept an empty array", function() {
		var p = Promise.all([]);
		assert.ok(p instanceof Promise);
	});

	it("should return a resolved promise whose result is empty array", function(done) {
		var p = Promise.all([]);

		assert.ok(p instanceof Promise);

		p.then(function(result) {
			assert.deepEqual([], result);
		}).then(done).catch(done);
	});
});

// 1 element
describe("25.4.4.1 Promise.all with 1-element array", function() {

	it("should accept an array of one promise", function(done) {
		var p1 = Promise.resolve(1);

		Promise.all([p1]).then(function(result) {
			assert.deepEqual([1], result);
		}).then(done).catch(done);
	});
	it("should resolve immediately", function(done) {
		var obj = {};

		var p1 = new Promise(function(resolve, reject) {
			resolve(obj);
		});

		Promise.all([p1]).then(function(resolved) {
			assert.deepEqual([obj], resolved);
		}).then(done).catch(done);
	});
	it("should reject immediately", function(done) {
		var obj = {};

		var p1 = new Promise(function(resolve, reject) {
			reject(obj);
		});

		Promise.all([p1])
			.then(unexpectedResolve(done), function(rejected) {
				assert.equal(obj, rejected);
			}).then(done).catch(done);

	});
});

// 2 elements
describe("25.4.4.1 with 2-element array", function() {
	it("should accept an array of two promises", function(done) {
		var p1 = Promise.resolve(1),
			p2 = Promise.resolve(2);

		Promise.all([p1, p2]).then(function(resolved) {
			assert.deepEqual([1, 2], resolved);
		}).then(done).catch(done);

	});

	it("should not resolve immediately when one of a two-promise array resolves", function(done) {
		var p1 = new Promise(function(resolve) {
				resolve(1);
			}),
			p2 = new Promise(function(resolve) {
				resolve(2);
			});

		var sequencer = [1];

		p1.then(function(resolved) {
			assert.deepEqual([1], sequencer);
			sequencer.push(2);
		}).catch(done);

		Promise.all([p1, p2]).then(function(resolved) {
			assert.deepEqual([1, 2, 3], sequencer);
			sequencer.push(4);
		}).then(done).catch(done);

		p2.then(function(resolved) {
			assert.deepEqual([1, 2], sequencer);
			sequencer.push(3);
		}).catch(done);

	});

	it("should should execute 'then' methods in sequence", function(done) {
		var p1 = Promise.resolve(100),
			p2 = Promise.resolve(200);

		var sequencer = [1];

		p1.then(function afterOne(resolved) {
			assert.deepEqual([1], sequencer);
			sequencer.push(2);
		}).catch(done);

		Promise.all([p1, p2]).then(function afterAll(resolved) {
			assert.deepEqual([1, 2, 3], sequencer);
			sequencer.push(4);
		}).then(done).catch(done);

		p2.then(function afterTwo(resolved) {
			assert.deepEqual([1, 2], sequencer);
			sequencer.push(3);
		}).catch(done);

	});
	// covered by case above
	//	it("should resolve after both promises of a two-promise array resolve");

	it("should reject immediately when the first member of a two-promise array rejects", function(done) {
		var rejectP1,
			p1 = new Promise(function(resolve, reject) {
				rejectP1 = reject;
			}),
			p2 = Promise.resolve(2);

		Promise.all([p1, p2])
			.then(unexpectedResolve(done))
			.catch(function(rejected) {
				assert.equal(rejected, 1);
			}).then(done).catch(done);

		rejectP1(1);
	});

	it("should reject immediately when the second member of a two-promise array rejects", function(done) {
		var rejectP2,
			p1 = Promise.resolve(1),
			p2 = new Promise(function(resolve, reject) {
				rejectP2 = reject;
			});

		Promise.all([p1, p2])
			.then(unexpectedResolve(done))
			.catch(function(rejected) {
				assert.equal(2, rejected);
			}).then(done).catch(done);

		rejectP2(2);
	});
});

// not explicitly addressed: 25.4.4.1.1 Promise.all Resolve Element Functions
// these are not visible from userland js
