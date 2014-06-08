"use strict";

var assert = require("assert"),
    path = require("path");

var helpers = require("./helpers.js");
var resolveAfter = helpers.resolveAfter;

describe("25.4.3 The Promise Constructor", function () {
    it("is the initial value of the Promise property of the global object", function () {
	assert.strictEqual(Promise, global.Promise);
    });

    // "When Promise is called as a function rather than as a constructor, it initializes
    // its 'this' value with the internal state necessary to suppot the 'Promise.prototype'
    // methods.
    it("can be called as a function", function () {
	assert.doesNotThrow(function () {
	    Promise();
	}, "expect a bare call to Promise() to succeed without error");
    });

    it("can be used as the value in an extends clause");

    // "Subclass constructors that intend to inherit the specified
    // Promise behaviour must include a 'super' call to Promise"
    
    // subclass constructors MAY include a 'super' call to Promise

    // subclass constructors *that intend to inherit specified Promise
    // behavior* MUST include such a call
});

describe("25.4.3.1 Promise ( executor )", function () {
    it("throws TypeError when 'this' is not of type Object", function () {
	assert.throws(function () {
	    Promise.call(3, function () {});
	}, TypeError);
    });

    it("throws TypeError if 'this' is a previously-initialized as-yet-unsettled Promise", function (done) {
	var p = new Promise(resolveAfter(10,1));

	// promise's [[PromiseState]] internal slot should be 'pending'
	// should throw
	assert.throws(function () {
	    Promise.call(p, function (resolve, reject) { resolve(2); });
	}, TypeError);
	
	// receive first resolution
	p.then(function (resolved) {
	    assert.equal(resolved, 1);
	});
    });

    it("throws TypeError if 'this' is a previously-settled Promise", function (done) {
	var p = new Promise(function (resolve, reject) { resolve(1); });
	
	function afterFirstResolution() {
	    // if promise's [[PromiseState]] internal slot is not 'undefined'
	    // should throw
	    assert.throws(function () {
		Promise.call(p, function (resolve, reject) { resolve(2); });
	    }, TypeError);

	    // affirm that previous resolution is still settled
	    p.then(function (resolved) {
		assert.equal(resolved, 1);
		done();
	    });
	    done();
	}

	// receive first resolution
	p.then(function (resolved) {
	    assert.equal(resolved, 1);

	    setImmediate(afterFirstResolution);
	});
    });

    it("throws TypeError if 'executor' is not Callable", function () {
	assert.throws(function () {
	    new Promise("not callable");
	}, TypeError);
    });
});

describe("25.4.3.1.1 InitializePromise ( promise, executor )", function () {
    it("returns a promise");
    it("catches exceptions thrown from executor and turns them into reject", function () {
	var errorObject = {};
	var p = new Promise(function () { throw errorObject; });
	p.then(undefined, function(err) {
	    assert.equal(this, undefined);
	    assert.equal(err, errorObject);
	});
    });
    it("returns a promise either in the 'pending' or 'rejected' state");
});

describe("25.4.3.2 new Promise ( ... argumentsList )", function () {
    it("is a constructor call");
});

describe("25.4.4 Properties of the Promise Constructor", function () {
    it("has a [[Protoype]] internal slot whose value is the Function prototype object");
    it("has a length property whose value is 1", function () {
	assert.equal(1, Promise.length);
    });
});

describe("Promise constructor", function () {
    it("is provided", function () {
	assert.equal(typeof Promise,"function");
    });

    it("returns a new Promise", function () {
	var p = new Promise(function () {});

	assert.ok(p instanceof Promise);
    });
});
