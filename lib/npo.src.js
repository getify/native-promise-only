// Native Promise Only - (c) 2014 Kyle Simpson - MIT License

(function UMD(name,context,definition){
	if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else if (typeof define === "function" && define.amd) { define(definition); }
	else { context[name] = context[name] || definition(name,context); }
})("Promise",this,function DEF(name,context){
	"use strict";

	function resolve(msg) {

	}

	function reject(msg) {

	}

	function then(success,failure) {

	}

	function __catch(failure) {

	}

	var construct = function Promise(cb) {
		var def = {
			promise: this,
			state: 0
		};
		this.then = then.bind(def);
		this["catch"] = __catch.bind(def);

		cb(resolve.bind(def),reject.bind(def));
	};

	construct.all = function all() {

	};

	return construct;
});
