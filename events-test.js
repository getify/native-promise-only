var path = require('path');
var Promise = require(path.join(__dirname,"lib","npo.src.js"));
var unHandled = [];
var count = {
	handled: 0,
	unhandled: 0
};
process.on('rejectionHandled', function (promise) {
	var index = unHandled.indexOf(promise);
	unHandled.splice(index, 1);
	console.log('Promise', index, 'handled.');
	count.handled++;
});
process.on('unhandledRejection', function (reason, promise) {
	var index = unHandled.length;
	unHandled.push(promise);
	console.log('Promise', index, 'rejected with reason', reason, 'and was not handled.');
	count.unhandled++;
});
var pr = Promise.reject('pr:Oops!');
setTimeout(function () {
	pr.catch(function (v) {
		console.log('Handled:', v);
	});
}, 1000);
var pr2 = Promise.reject('pr2:Oops!');
pr2.then(function (){/*Never runs*/console.log('I should never run!'); });
var pr3 = Promise.reject('pr3:Oops!');
pr3.then(function (){/*Never runs*/console.log('I should never run!'); }, function (v) {
			console.log('Rejection Handled:', v);
		});
setTimeout(function () {
	console.log(unHandled);
	console.log(count);
	require('assert')(unHandled.length === 1, 'unHandled\'s length should be two');
}, 5000);