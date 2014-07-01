"use strict";


describe("Sequencing tests from promises-aplus/issue #61", function() {
	it("T1", function(done) {

		var resolveP1, rejectP2, sequencer = [];

		(new Promise(function(resolve, reject) {
			resolveP1 = resolve;
		})).then(function(msg) {
			sequencer.push(msg);
		}).then(function() {
			assert.deepEqual(["A", "B"], sequencer);
		}).then(done).catch(done);

		(new Promise(function(resolve, reject) {
			rejectP2 = reject;
		})).catch(function(msg) {
			sequencer.push(msg);
		});

		rejectP2("A");
		resolveP1("B");

	});

	it("T2a", function(done) {
		var resolveP1, rejectP2, p1, p2,
			sequencer = [];

		p1 = new Promise(function(resolve, reject) {
			resolveP1 = resolve;
		});
		p2 = new Promise(function(resolve, reject) {
			rejectP2 = reject;
		});

		rejectP2("B");
		resolveP1("A");

		p1.then(function(msg) {
			sequencer.push(msg);
		});

		p2.catch(function(msg) {
			sequencer.push(msg);
		}).then(function() {
			assert.deepEqual(["A", "B"], sequencer);
		}).then(done).catch(done);
	});

	it("T2b", function(done) {

		var resolveP1, rejectP2, p1, p2,
			sequencer = [];

		p1 = new Promise(function(resolve, reject) {
			resolveP1 = resolve;
		});
		p2 = new Promise(function(resolve, reject) {
			rejectP2 = reject;
		});

		rejectP2("B");
		resolveP1("A");

		setTimeout(function() {
			p1.then(function(msg) {
				sequencer.push(msg);
			});

			p2.catch(function(msg) {
				sequencer.push(msg);
			}).then(function() {
				assert.deepEqual(["A", "B"], sequencer);
			}).then(done).catch(done);
		}, 0);

	});
});
