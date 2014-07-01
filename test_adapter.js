"use strict";
// Adapter for "promises-aplus-tests" test runner
var path = require("path");
var assert = require("assert");

function chooseSource(file) {
	file = file || "/lib/npo.src.js"; // default to un-uglified
	
	var Promise = require(path.join(__dirname,file));
	setExports(module.exports, Promise);
	
	return module.exports;
};
module.exports = chooseSource;

function setExports(exports, Promise) {
    var savedPromise;

	exports.deferred = function __deferred__() {
		var o = {};
		o.promise = new Promise(function __Promise__(resolve,reject){
			o.resolve = resolve;
			o.reject = reject;
		});
		return o;
	};
	
	exports.resolved = function __resolved__(val) {
		return Promise.resolve(val);
	};
	
	exports.rejected = function __rejected__(reason) {
		return Promise.reject(reason);
	};

        exports.defineGlobalPromise = function __defineGlobalPromise__(globalScope) {
	    savedPromise = globalScope.Promise;
	    globalScope.Promise = Promise;

	    global.assert = assert;
	};

        exports.removeGlobalPromise = function __defineGlobalPromise__(globalScope) {
	    delete globalScope.Promise;
	    globalScope.Promise = savedPromise;
	};
}

// call with default of undefined; backwards-compatible with old use of adapter
chooseSource();
