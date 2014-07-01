"use strict";


describe("incorrect subclassing:", function () {
    describe("25.4.1.6.1 step 8 invalid 'resolve':", function() {
    
	function BadResolverPromise(executor) {
	    var p = new Promise(executor);
	    executor(3, function () {});

	    this.then = p.then;
	    this.constructor = BadResolverPromise;
	}
	BadResolverPromise.prototype = Promise.prototype;
	BadResolverPromise.all = Promise.all;
	BadResolverPromise.race = Promise.race;
	BadResolverPromise.reject = Promise.reject;
	BadResolverPromise.resolve = Promise.resolve;

	it("throws TypeError with Promise.reject", function (done) {
	    assert.throws(function() {
		BadResolverPromise.reject(2);
	    }, TypeError);

	    done();
	});

	it("provides a resolve which is not a function", function (done) {
	    var brp = new BadResolverPromise(function executor(resolve, reject) {
		assert(typeof resolve != "function");
	    });

	    assert(brp.constructor === BadResolverPromise);
	    done();
	});
	
	it("throws TypeError with Promise.all", function (done) {
	    assert.throws(function() {
		BadResolverPromise.all([1, 2]);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.race", function (done) {
	    assert.throws(function() {
		BadResolverPromise.race([1, 2]);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.resolve", function (done) {
	    assert.throws(function() {
		BadResolverPromise.resolve(1);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.then", function (done) {
	    assert.throws(function() {
		new BadResolverPromise(function () {}).then(function () {});
	    }, TypeError);

	    done();
	});
    });

    describe("25.4.1.6.1 step 9 invalid 'reject'", function() {
    
	function BadRejectorPromise(executor) {
	    var p = new Promise(executor);
	    executor(function () {}, 4);

	    this.then = p.then;
	    this.constructor = BadRejectorPromise;
	}
	BadRejectorPromise.prototype = Promise.prototype;
	BadRejectorPromise.all = Promise.all;
	BadRejectorPromise.race = Promise.race;
	BadRejectorPromise.reject = Promise.reject;
	BadRejectorPromise.resolve = Promise.resolve;

	it("provides a reject which is not a function", function (done) {
	    new BadRejectorPromise(function executor(resolve, reject) {
		assert(typeof reject != "function");
		done();
	    });
	});
	
	it("throws TypeError with Promise.all", function (done) {
	    assert.throws(function() {
		BadRejectorPromise.all([1, 2]);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.race", function (done) {
	    assert.throws(function() {
		BadRejectorPromise.race([1, 2]);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.resolve", function (done) {
	    assert.throws(function() {
		BadRejectorPromise.resolve(1);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.reject", function (done) {
	    assert.throws(function() {
		BadRejectorPromise.reject(2);
	    }, TypeError);

	    done();
	});

	it("throws TypeError with Promise.then", function (done) {
	    assert.throws(function() {
		new BadRejectorPromise(function () {}).then(function () {});
	    }, TypeError);

	    done();
	});
    });
});
