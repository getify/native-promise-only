"use strict";

var assert = require("assert"),
    path = require("path");

require("../lib/npo.src.js");

describe("simple promise and resolve/reject", function () {

    it("should resolve on a timer", function (done) {
	var p = new Promise(function (resolve,reject) {
	    setTimeout(resolve, 50, 1);
	}).then(function (resolved) {
	    assert.equal(resolved, 1);
	    done();
	});
    });
});
