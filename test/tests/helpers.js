"use strict";

var assert = require('assert');


module.exports.unexpectedResolve = function unexpectedResolve(resolved) {
    setImmediate(function () {
	throw "Unexpected resolve " + resolved;
    });
}

module.exports.unexpectedReject = function unexpectedReject(err) { 
    setImmediate(function () {
	throw "Unexpected reject " + err;
    });
}

module.exports.resolveImmediately = function resolveImmediately(arg) {
	return function (resolve, reject) {
		setImmediate(function () { resolve(arg); });
	};
}

module.exports.rejectImmediately = function rejectImmediately(arg) {
	return function (resolve, reject) {
		setImmediate(function () { reject(arg); });
	};
}

module.exports.resolveAfter = function resolveAfter(time, arg) {
	return function (resolve, reject) {
		setTimeout(function () { resolve(arg); }, time);
	};
}

module.exports.rejectAfter = function rejectAfter(time, arg) {
	return function (resolve, reject) {
		setTimeout(function () { reject(arg); }, time);
	};
}

module.exports.expectedResolve = function expectedResolve(obj, done) {
	return function (resolved) {
	    setImmediate(function () {
		assert.equal(obj, resolved);
		done();
	    });
	};
}

module.exports.expectedResolveDeep = function expectedResolveDeep(obj, done) {
	return function (resolved) {
	    setImmediate(function () {
		assert.deepEqual(obj, resolved);
		done();
	    });
	};
}

module.exports.expectedReject = function expectedReject(obj, done) {
	return function (resolved) {
	    setImmediate(function (){
		assert.equal(obj, resolved);
		done();
	    });
	};
}

module.exports.neverResolve = function neverResolve() {
};
