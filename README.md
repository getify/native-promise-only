# Native Promise Only (NPO)

A polyfill for native ES6 Promises that deviates as little as possible from the strict spec definition (no add-ons).

## Known Limitations

A promise object **will be** an instance of the `Promise` constructor:

```js
var p = new Promise(..);

p instanceof Promise; // true
```

However, these promise instances don't inherit (delegate to) a meaningful `Promise.prototype` object. That is:

```js
var p = new Promise(..);

Object.getOwnPropertyNames( p ); // [ then, catch ]
Object.getOwnPropertyNames( Promise.prototype ); // [ constructor ]
```

As such, these promises are not really "sub-classable" in the ES6 `class` / `extends` sense, though theoretically you should be able to do that in ES6.

The reason for this deviation is that there's a choice between having delegated methods on the `.prototype` or having private state. Since **the spirit of promises was always to ensure trustability** -- that they were immutable to everyone except the initial resolver/deferred -- private state is a critically important feature to preserve.

Many other ES6 promise shims/libs seem to have forgotten that important point, as many of them either expose the state publicly on the object instance or provide public accessor methods which can externally mutate a promise's state. Both of these deviations are intolerable in my opinion, so this library chose the opposite trade-off: loss of ES6 sub-classing.

## Test Compliance

This polyfill/shim is aiming to be "spec compliant" in the sense of passing all tests in the [Promises/A+ Test Suite](https://github.com/promises-aplus/promises-tests).

Test status at present:

```
824 passing
48 failing
```

To run the test suite after cloning this repo, run `npm install` to install the dev-dependencies, then run `npm test`.

## License

The code and all the documentation are released under the MIT license.

http://getify.mit-license.org/
