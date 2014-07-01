"use strict";


describe("25.4.4.4 Promise.reject( x )", function() {
	it("is a function", function() {
		assert.equal("function", typeof Promise.reject);
	});
	it("expects one argument", function() {
		assert.equal(1, Promise.reject.length);
	});
	it("always creates a new promise using 'this' as constructor", function() {
		var p = Promise.reject(3);

		assert.ok(p instanceof Promise);
	});
	it("throws if 'this' is not a constructor", function() {
		var notAConstructor = 3;

		assert.throws(function() {
			Promise.reject.call(notAConstructor, 4);
		}, TypeError);
	});
	it("always returns a rejected promise", function(done) {
		var p = Promise.reject(3);
		p.then(function() {
			throw new Error("unexpected resolve");
		}, function(rejected) {
			assert.equal(3, rejected);
		}).then(done).catch(done);
	});
});
