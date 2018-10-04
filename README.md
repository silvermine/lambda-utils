# Silvermine Lambda Utilities

[![Build Status](https://travis-ci.org/silvermine/lambda-utils.svg?branch=master)](https://travis-ci.org/silvermine/lambda-utils)
[![Coverage Status](https://coveralls.io/repos/github/silvermine/lambda-utils/badge.svg?branch=master)](https://coveralls.io/github/silvermine/lambda-utils?branch=master)
[![Dependency Status](https://david-dm.org/silvermine/lambda-utils.svg)](https://david-dm.org/silvermine/lambda-utils)
[![Dev Dependency Status](https://david-dm.org/silvermine/lambda-utils/dev-status.svg)](https://david-dm.org/silvermine/lambda-utils#info=devDependencies&view=table)


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
