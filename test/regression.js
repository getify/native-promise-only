// regression for issue #38
var assert = require('assert'),
    path = require('path');

describe("when Object.defineProperty may be broken", function () {
    var realDefineProperty = Object.defineProperty;
    var guards = path.join(__dirname, "../lib/guards.js");

    beforeEach(function () {
        Object.defineProperty = undefined;
    });
    afterEach(function () {
        Object.defineProperty = realDefineProperty;
        delete require.cache[guards];
    });

    it("runs a test suite", function () {
        assert.equal(1,1);   
    });

    it("works under node/v8 with no changes", function () {
        Object.defineProperty = realDefineProperty;
        require(guards);
        assert.equal(Object.defineProperty.NPO_AVOID, undefined);
    });

    it("identifies a fully broken object.defineProperty", function () {
        Object.defineProperty = function () {};
        require(guards);
        assert.equal(Object.defineProperty.NPO_AVOID, true);
    });

    it("identifies a partially broken object.defineProperty", function () {
        Object.defineProperty = function (obj, name, prop) {
            if ((obj instanceof Function) && name === "prototype") return;

            return realDefineProperty(obj, name, prop);
        };
        require(guards);
        assert.equal(Object.defineProperty.NPO_AVOID, true);
    });
});
