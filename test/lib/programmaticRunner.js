"use strict";

var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");

var testsDir = path.resolve(__dirname, "../tests");

function normalizeAdapter(adapter) {
    if (!adapter.resolved) {
        adapter.resolved = function (value) {
            var d = adapter.deferred();
            d.resolve(value);
            return d.promise;
        };
    }

    if (!adapter.rejected) {
        adapter.rejected = function (reason) {
            var d = adapter.deferred();
            d.reject(reason);
            return d.promise;
        };
    }
}

function setUpAdapter(adapter) {
    global.adapter = adapter;
    adapter.defineGlobalPromise(global);
}

function tearDownAdapter(adapter) {
    adapter.removeGlobalPromise(global);
    delete global.adapter;
}

module.exports = function (adapter, mochaOpts, cb) {
    if (typeof mochaOpts === "function") {
        cb = mochaOpts;
        mochaOpts = {};
    }
    if (typeof cb !== "function") {
        cb = function () { };
    }

    normalizeAdapter(adapter);

    // can't reach npm server
    mochaOpts.timeout = mochaOpts.timeout || 200;
    mochaOpts.slow = mochaOpts.slow || Infinity;

    fs.readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        var mocha = new Mocha(mochaOpts);
        testFileNames.forEach(function (testFileName) {
            if (path.extname(testFileName) === ".js") {
                var testFilePath = path.resolve(testsDir, testFileName);
                mocha.addFile(testFilePath);
            }
        });

	setUpAdapter(adapter);
        mocha.run(function (failures) {
	    tearDownAdapter(adapter);
            if (failures > 0) {
                var err = new Error("Test suite failed with " + failures + " failures.");
                err.failures = failures;
                cb(err);
            } else {
                cb(null);
            }
        });
    });
};

module.exports.mocha = function (adapter) {
    normalizeAdapter(adapter);

    setUpAdapter(adapter);

    var testFileNames = fs.readdirSync(testsDir);
    testFileNames.forEach(function (testFileName) {
        if (path.extname(testFileName) === ".js") {
            var testFilePath = path.resolve(testsDir, testFileName);
            require(testFilePath);
        }
    });

    tearDownAdapter(adapter);
};
