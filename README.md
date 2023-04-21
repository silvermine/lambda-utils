# Silvermine Lambda Utilities

[![NPM Version][npm-version]][npm-version-url]
[![License][license-badge]](./LICENSE)
[![Build Status][build-status]][build-status-url]
[![Coverage Status][coverage-status]][coverage-status-url]
![Conventional Commits][conventional-commits-url]

## What is it?

This is a collection of utility functions that may be useful if you are working
with AWS Lambda, and especially if you prefer promises over callbacks.

## How do I use it?

The code is primarily a set of autonomous functions that you can import and use
in your code. They are all well-tested, small, and stable. Here's an example of
how you would use them:

```js
var handler = require('silvermine-lambda-utils/callPromiseFunctionIgnoreResolvedValueHandler'),
    MyService = require('./MyService');

module.exports = {

   handler: function(evt, context, cb) {
      var svc = new MyService();

      handler(svc.doSomething.bind(svc), context, cb);
   },

};
```

## How do I contribute?

We genuinely appreciate external contributions. See [our extensive
documentation](https://github.com/silvermine/silvermine-info#contributing) on
how to contribute.

## License

This software is released under the MIT license. See [the license
file](LICENSE) for more details.

[npm-version]: https://img.shields.io/npm/v/@silvermine/lambda-utils.svg
[npm-version-url]: https://www.npmjs.com/package/@silvermine/lambda-utils
[license-badge]: https://img.shields.io/github/license/silvermine/lambda-utils.svg
[build-status]: https://github.com/silvermine/lambda-utils/actions/workflows/ci.yml/badge.svg
[build-status-url]: https://travis-ci.org/silvermine/lambda-utils.svg?branch=master
[coverage-status]: https://coveralls.io/repos/github/silvermine/lambda-utils/badge.svg?branch=master
[coverage-status-url]: https://coveralls.io/github/silvermine/lambda-utils?branch=master
[conventional-commits-url]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
