// Native Promise Only - (c) 2014 Kyle Simpson - MIT License

(function UMD(name,context,definition){
	if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else if (typeof define === "function" && define.amd) { define(definition); }
	else { context[name] = context[name] || definition(name,context); }
})("Promise",this,function DEF(name,context){
	"use strict";

	function schedule(fn) {
		return (typeof setImmediate !== "undefined") ?
			setImmediate(fn) : setTimeout(fn,0)
		;
	}

	function chain(o,target) {
		var fn;

		if (o.state !== 2 && o.success) {
			while ((fn = o.success.shift())) {
				target.then(fn);
			}
		}
		if (o.state !== 1 && o.failure) {
			while ((fn = o.success.shift())) {
				target.then(void 0,fn);
			}
		}
	}

	// promise duck typing?
	function thenable(o) {
		return (
			(typeof o === "object" || typeof o === "function") &&
			"then" in o
		);
	}

	function notify() {
		if (this.state === 0) {
			return;
		}

		var fn, ret;

		if (this.state === 1 && this.success) {
			while ((fn = this.success.shift())) {
				ret = fn(this.msg);
				if (thenable(ret)) {
					chain(this,ret);
					break;
				}
			}
		}
		if (this.state === 2 && this.failure) {
			while ((fn = this.failure.shift())) {
				ret = fn(this.msg);
				if (thenable(ret)) {
					chain(this,ret);
					break;
				}
			}
		}
	}

	function resolve(msg) {
		if (this.state !== 0) {
			return;
		}

		this.msg = msg;
		this.state = 1;
		schedule(notify.bind(this));
	}

	function reject(msg) {
		if (this.state !== 0) {
			return;
		}

		this.msg = msg;
		this.state = 2;
		schedule(notify.bind(this));
	}

	function then(success,failure) {
		if (success && this.state !== 2) {
			(this.success = this.success || []).push(success);
		}
		if (arguments.length > 1 && this.state !== 1) {
			(this.failure = this.failure || []).push(failure);
		}
		schedule(notify.bind(this));

		return this.promise;
	}

	function __catch(failure) {
		return then(void 0,failure);
	}

	var construct = function Promise(cb) {
		var def = {
			promise: this,
			state: 0
		};
		this.then = then.bind(def);
		this["catch"] = __catch.bind(def);

		try {
			cb(resolve.bind(def),reject.bind(def));
		}
		catch (err) {
			reject.call(def,err);
		}
	};

	construct.all = function all() {

	};

	return construct;
});
