# ECMAScript 6 Promises Test Suite

This suite tests compliance of a promise implementation with the [ECMA-262 6th Edition Draft specification][].

[ECMA-262 6th Edition Draft specification]: https://people.mozilla.org/~jorendorff/es6-draft.html

## How To Run

The tests run in a Node.js environment.

### Adapters

In order to test a promise library, you must expose a minimal adapter interface.  This is an extension
of the [Promises/A+ test adapter](https://github.com/promises-aplus/promises-tests#adapters), with
the following additional exports:

- `defineGlobalPromise(globalScope)`: ensures that `globalScope.Promise` is the implementation to be tested
- `removeGlobalPromise(globalScope)`: removes `Promise` from `globalScope`

When a native (browser or node) implementation of Promises is being tested, it is fine for these to be no-ops.

When a polyfill or other Javascript implementation of Promises is being tested, these functions should 
modify the passed-in `globalScope` object, not the `global` object.

### From the CLI

