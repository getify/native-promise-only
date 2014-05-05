// Native Promise Only - (c) 2014 Kyle Simpson - MIT License

(function UMD(name,context,definition){
	if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else if (typeof define === "function" && define.amd) { define(definition); }
	else { context[name] = context[name] || definition(name,context); }
})("Promise",this,function DEF(){
	/*jshint validthis:true */
	"use strict";

	function schedule(fn) {
		return (typeof setImmediate !== "undefined") ?
			setImmediate(fn) : setTimeout(fn,0)
		;
	}

	// promise duck typing?
	function isThenable(o) {
		return (
			(typeof o === "object" || typeof o === "function") &&
			isFunction(o.then)
		);
	}

	function isFunction(fn) {
		return (typeof fn === "function");
	}

	function error(msg) {
		this.msg = msg;
		this.state = 2;
		schedule(notify.bind(this));
	}

	function resolveChained(msg) {
		var def;

		if (this.chained) {
			while ((def = this.chained.shift())) {
				def.resolve(msg);
			}
		}
	}

	function rejectChained(msg) {
		var def;

		if (this.chained) {
			while ((def = this.chained.shift())) {
				def.reject(msg);
			}
		}
	}

	function notify() {
		if (this.state === 0) {
			return;
		}

		var fn, ret;

		if (this.state === 1) {
			if (this.success) {
				while ((fn = this.success.shift())) {
					try {
						ret = fn(this.msg);
					}
					catch (err) {
						rejectChained.call(this,err);
						break;
					}
					if (isThenable(ret)) {
						ret.then(resolveChained.bind(this),rejectChained.bind(this));
					}
					else {
						resolveChained.call(this,ret);
					}
				}
			}
			else {
				resolveChained.call(this,this.msg);
			}
		}
		if (this.state === 2) {
			if (this.failure) {
				while ((fn = this.failure.shift())) {
					try {
						ret = fn(this.msg);
					}
					catch (err) {
						rejectChained.call(this,err);
					}
					if (isThenable(ret)) {
						ret.then(resolveChained.bind(this),rejectChained.bind(this));
					}
					else {
						rejectChained.call(this,ret);
					}
				}
			}
			else {
				rejectChained.call(this,this.msg);
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

		error.call(this,msg);
	}

	function then(success,failure) {
		if (this.state !== 2 && isFunction(success)) {
			(this.success = this.success || []).push(success);
		}
		if (this.state !== 1 && isFunction(failure)) {
			(this.failure = this.failure || []).push(failure);
		}
		schedule(notify.bind(this));

		return new Promise(function __Promise__(resolve,reject){
			(this.chained = this.chained || []).push({
				resolve: resolve,
				reject: reject
			});
		}.bind(this));
	}

	function __catch(failure) {
		return this.promise.then(void 0,failure);
	}

	function Promise(cb) {
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
	}

	Promise.resolve = function __resolve__(msg) {
		return new Promise(function __Promise__(resolve){
			resolve(msg);
		});
	};

	Promise.reject = function __reject__(msg) {
		return new Promise(function __Promise__(_,reject){
			reject(msg);
		});
	};

	Promise.all = function __all__(arr) {
		if (!Array.isArray(arr)) {
			throw new TypeError("Promise.all requires an array");
		}

		return new Promise(function __Promise__(resolve,reject){
			var msgs, count = 0, len = arr.length;

			if (len === 0) {
				resolve([]);
			}

			msgs = [];

			function resolveCheck(idx,msg) {
				msgs[idx] = msg;
				count++;
				if (count === len) {
					resolve(msgs);
				}
			}

			arr.forEach(function __foreach__(v,idx){
				if (!isThenable(v)) {
					v = Promise.resolve(v);
				}

				v.then(resolveCheck.bind(null,idx),reject);
			});
		});
	};

	Promise.race = function __race__(arr) {
		if (!Array.isArray(arr)) {
			throw new TypeError("Promise.race requires an array");
		}

		return new Promise(function __Promise__(resolve,reject){
			// use `some(..)` so we can quit early if we need to
			arr.some(function __foreach__(v){
				if (!isThenable(v)) {
					resolve(v);
					return true; // quit early
				}

				v.then(resolve,reject);
			});
		});
	};

	return Promise;
});
