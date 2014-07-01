"use strict";


describe("25.4.4.5 Promise.resolve( x )", function() {
	it("is a function", function() {
		assert.equal("function", typeof Promise.resolve);
	});
	it("expects one argument", function() {
		assert.equal(1, Promise.resolve.length);
	});

	it("passes through a resolved promise created with the same constructor as 'this'", function(done) {
		var p1 = new Promise(function(resolve) {
				resolve(1);
			}),
			p2;

		p1.then(function(r1) {
			assert.equal(1, r1);
			p2 = Promise.resolve(p1);
			p2.then(function(r2) {
				assert.equal(1, r2);
				assert.equal(p1, p2);
			}).then(done).catch(done);
		}).catch(done);
	});

	it("passes through an unsettled promise created with the same constructor as 'this'", function(done) {
		var resolveP1,
			p1 = new Promise(function(resolve) {
				resolveP1 = resolve;
			}),
			p2 = Promise.resolve(p1);

		p1.then(function(r1) {
			assert.equal(1, r1);
		}).catch(done);

		p2.then(function(r2) {
			assert.equal(1, r2);
			assert.equal(p1, p2);
		}).then(done).catch(done);

		resolveP1(1);
	});


	// otherwise (called on value not created by 'this' constructor)
	it("creates a new promise using the supplied constructor", function() {
		var p1 = Promise.resolve(3);

		assert.ok(p1 instanceof Promise);
	});
	it("throws if 'this' is not a constructor", function() {
		var notAConstructor = 3;

		assert.throws(function() {
			Promise.resolve.call(notAConstructor, 4);
		}, TypeError);
	});

	it("can return a resolved promise", function(done) {
		var p1 = Promise.resolve(3);

		p1.then(function(resolved) {
			assert.equal(3, resolved);
		}).then(done).catch(done);
	});

	it("can return a pending promise", function(done) {
		var p1 = new Promise(function(resolve) {
			resolve("resolve");
		});

		var sequencer = [1];

		var p2 = Promise.resolve(p1).then(function(resolved) {
			assert.equal("resolve", resolved);

			sequencer.push(3);
			assert.deepEqual([1, 2, 3], sequencer);

		}).then(done).catch(done);

		sequencer.push(2);
	});

	it("can return a rejected promise", function(done) {
		var p1 = Promise.reject(3);
		var p2 = Promise.resolve(p1);

		p2.then(function(resolve) {
			throw new Error("unexpected resolve " + resolve);
		}, function(rejected) {
			assert.equal(3, rejected);
		}).then(done).catch(done);
	});

	// 25.4.4.5 steps 2 a & b:
	// 2. if IsPromise(x) is true
	//   a. Let constructor be the value of x's PromiseConstructor
	//   b. if SameValue(Constructor, C) is true, return x
	it("can pass through a subclassed promise if passed a subclassed promise");
});
