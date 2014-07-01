"use strict";


describe("25.4.3 The Promise Constructor", function() {
	it("is the initial value of the Promise property of the global object", function() {
		assert.strictEqual(Promise, global.Promise);
	});

	it("can be called as a function");
	// requires a functioning ES6 Symbol.create
	//, function () {
	//	var p = Promise[Symbol.create]();
	// assert.doesNotThrow(function () {
	// Promise.call(p, function () {});
	// });
	//});

	it("can be used as the value in an extends clause");

	// "Subclass constructors that intend to inherit the specified
	// Promise behaviour must include a 'super' call to Promise"

	// subclass constructors MAY include a 'super' call to Promise

	// subclass constructors *that intend to inherit specified Promise
	// behavior* MUST include such a call
});

describe("25.4.3.1 Promise ( executor )", function() {

	it("throws TypeError when 'this' is not of type Object", function() {
		assert.throws(function() {
			Promise.call(3, function() {});
		}, TypeError);
	});

	it("throws TypeError if 'this' is a constructed, but unresolved Promise", function(done) {
		var resolveP,
			p = new Promise(function(resolve, reject) {
				resolveP = resolve;
			});

		// promise's [[PromiseState]] internal slot should be 'pending'
		// should throw
		assert.throws(function() {
			Promise.call(p, function(resolve, reject) {
				resolve(2);
			});
		}, TypeError);

		// receive first resolution
		p.then(function(resolved) {
			assert.equal(1, resolved);
		}).then(done).catch(done);

		resolveP(1);
	});

	it("throws TypeError if 'this' is a resolved Promise", function(done) {
		var p = new Promise(function(resolve, reject) {
			resolve(1);
		});

		function afterFirstResolution() {
			// if promise's [[PromiseState]] internal slot is not 'undefined'
			// should throw
			assert.throws(function() {
				Promise.call(p, function(resolve, reject) {
					resolve(2);
				});
			}, TypeError);

			// affirm that previous resolution is still settled
			p.then(function(resolved) {
				assert.equal(1, resolved);
			}).then(done).catch(done);
		}

		// receive first resolution
		p.then(function(resolved) {
			assert.equal(resolved, 1);

			Promise.resolve().then(afterFirstResolution).catch(done);
		}).catch(done);
	});

	it("throws TypeError if 'executor' is not Callable", function() {
		assert.throws(function() {
			new Promise("not callable");
		}, TypeError);
	});
});

describe("25.4.3.1.1 InitializePromise ( promise, executor )", function() {
	it("returns a promise");
	it("invokes the executor with 'this' = 'undefined'", function() {
		var savedThis;
		var p = new Promise(function() {
			savedThis = this;
		});

		assert.equal(undefined, savedThis);
	});
	it("catches exceptions thrown from executor and turns them into reject", function(done) {
		// if completion is an abrupt completion
		var errorObject = {};

		var p = new Promise(function() {
			throw errorObject;
		});

		p.then(undefined, function(err) {
			assert.equal(undefined, this);
			assert.equal(errorObject, err);
		}).then(done).catch(done);

	});

	it("returns a promise either in the 'pending' or 'rejected' state");
});

describe("25.4.3.2 new Promise ( ... argumentsList )", function() {
	it("is a constructor call");
});

describe("25.4.4 Properties of the Promise Constructor", function() {
	it("has a [[Protoype]] internal slot whose value is the Function prototype object");
	it("has a length property whose value is 1", function() {
		assert.equal(1, Promise.length);
	});
});

describe("Promise constructor", function() {
	it("is provided", function() {
		assert.equal(typeof Promise, "function");
	});

	it("returns a new Promise", function() {
		var p = new Promise(function() {});

		assert.ok(p instanceof Promise);
	});
});
