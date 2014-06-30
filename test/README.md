# ECMAScript 6 Promises Test Suite

This suite tests compliance of a promise implementation with the [ECMA-262 6th Edition Draft specification][].

[ECMA-262 6th Edition Draft specification]: https://people.mozilla.org/~jorendorff/es6-draft.html

Since ECMA-262 is still a **draft** specification, this test suite
should not be regarded as final or complete.  This test suite is
intended to be contributed to the ECMA test262 project for ES6;
however, until it is incorporated into test262, it should **NOT** be
regarded as a definitive claim of what the ES6 standard requires.

These tests also do **NOT** supersede the promises-aplus tests.  These
tests are orthogonal to promises-aplus/pormises-tests.  For best
results, run both sets of tests.  This is done by default by the included 
test case `test/tests/zz_aplus_suite`.

## How To Run

The tests run in a Node.js environment.

### Adapters

In order to test a promise library, you must expose a minimal adapter
interface.  This is an extension of the [Promises/A+ test
adapter](https://github.com/promises-aplus/promises-tests#adapters),
with the following additional exports:

- `defineGlobalPromise(globalScope)`: ensures that `globalScope.Promise` is the implementation to be tested
- `removeGlobalPromise(globalScope)`: removes `Promise` from `globalScope`

When a native (browser or node) implementation of Promises is being tested, these functions can have 
empty bodies (it is fine for these to be no-ops).

When a polyfill or other Javascript implementation of Promises is being tested, these functions should 
modify the passed-in `globalScope` object, not the `global` object.

### From the CLI

This package can be invoked with a command-line interface, similarly to `promises-aplus-tests`.

As a globally installed package:

     $ npm install -g promises-es6-tests
     $ promises-es6-tests test_adapter

As a dependent package:

```json
{
    "devDependencies": {
        "promises-aplus-tests": "*",
        "promises-es6-tests": "*"
    },
    "scripts": {
        "test": "run-tests && promises-aplus-tests test_adapter && promises-es6-tests test_adapter"
    }
}
```

The CLI takes as its first argument the name of the adapter file, relative to the current working
directory.  It passes through any subsequent options to Mocha.

### Programmatically

The main export of this package is a function that allows you to run the tests against an adapter:

```js
var promisesES6Tests = require("promises-es6-tests");

promisesES6Tests(adapter, function (err) {
    // tests complete; output to console; `err` is number of failures
});
```

## Structure of Tests

