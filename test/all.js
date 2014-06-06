"use strict";

var assert = require("assert"),
    path = require("path");

require("../lib/npo.src.js");

function unexpectedResolve(resolved) {
    throw "Unexpected resolve " + resolve;
}

function unexpectedReject(err) { 
    throw "Unexpected reject " + err;
}

function resolveImmediately(arg) {
    return function (resolve, reject) {
	setImmediate(function () { resolve(arg); });
    };
}

function rejectImmediately(arg) {
    return function (resolve, reject) {
	setImmediate(function () { reject(arg); });
    };
}

function resolveAfter(time, arg) {
    return function (resolve, reject) {
	setTimeout(function () { resolve(arg); }, time);
    };
}

function rejectAfter(time, arg) {
    return function (resolve, reject) {
	setTimeout(function () { reject(arg); }, time);
    };
}

// behavior from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Static_methods
describe("ES6 Promise.all", function () {
    it("should be a function", function() {
	assert.equal(typeof Promise.all,"function");
    });
    it("should take a single, iterable argument", function () {
	assert.equal(Promise.all.length,1);
    });
    
    it("should immediately reject for non-Array argument", function (done) {
	Promise.all({}).then(unexpectedResolve, function (err) {
	    assert.ok(err instanceof TypeError);
	    assert.equal("Not an array", err.message);
	    done();
	});

    });

    // 0 elements
    describe("with 0-element array", function () {

	it("should accept an empty array", function () {
	    var p = Promise.all([]);
	});
	it("should return a resolved promise", function (done) {
	    var p = Promise.all([]);
	    assert.ok(p instanceof Promise);
	    p.then(function(result) {
		done();
	    }, unexpectedReject );
	});
    });

    describe("with 1-element array", function () {
	// 1 element
	it("should accept an array of one promise", function (done) {
	    var p1 = new Promise(resolveImmediately(1));
	    
	    Promise.all([p1]).then(function (resolved) {
		assert.equal(resolved, 1);
		done();
	    }, unexpectedReject);
	});
	it("should resolve immediately", function (done) {
	    var obj = {};
	    
	    var p1 = new Promise(resolveAfter(10, obj));

	    Promise.all([p1]).then(function (resolved) {
		assert.equal(resolved[0], obj);
		done();
	    });
	});
	it("should reject immediately", function (done) {
	    var obj = {};
	    
	    var p1 = new Promise(rejectImmediately(obj));

	    Promise.all([p1]).then(unexpectedResolve, function (err) {
		assert.equal(err, obj);
		done();
	    });
	});
    });
    
    // 2 elements
    describe("with 2-element array", function () {
	it("should accept an array of two promises", function (done) {
	    var p1 = new Promise(resolveImmediately(1)),
		p2 = new Promise(resolveImmediately(2));
		
	    Promise.all([p1, p2]).then(function (resolved) {
		assert.deepEqual(resolved, [1, 2]);
		done();
	    }, unexpectedReject);

	});

	it("should not resolve immediately when one of a two-promise-array resolves", function (done) {
	    var p1 = new Promise(resolveAfter(10, 1)),
		p2 = new Promise(resolveAfter(20, 2));

	    var allResolved = false;

	    Promise.all([p1, p2]).then(function (resolved) {
		allResolved = true;
		done();
	    }, unexpectedReject);

	    p1.then(function (resolved) {
		assert.equal(resolved, 1);
		assert.equal(allResolved, false);
	    });

	    p2.then(function (resolved) {
		assert.equal(resolved, 2);
		assert.equal(allResolved, true);
	    });
	});
// covered by case above
//	it("should resolve after both promises of a two-promise-array resolve");

	it("should reject immediately when the first member of a two-promise-array rejects", function (done) {
	    var p1 = new Promise(rejectAfter(10, 1)),
		p2 = new Promise(resolveAfter(20, 2));
	    
	    Promise.all([p1, p2]).then(unexpectedResolve, function (err) {
		assert.equal(err, 1);
		done();
	    });
	});

	it("should reject immediately when the second member of a two-promise-array rejects", function (done) {
	    var p1 = new Promise(resolveAfter(10, 1)),
		p2 = new Promise(rejectAfter(20, 2));
	    
	    Promise.all([p1, p2]).then(unexpectedResolve, function (err) {
		assert.equal(err, 2);
		done();
	    });
	});
    });
});
