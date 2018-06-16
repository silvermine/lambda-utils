'use strict';

var makeHandler = require('./_makeLambdaHandler');

/**
 * Properly converts a function that returns a promise into a handler for a Lambda
 * function. Any response / value that the promise is resolved with is what's passed to
 * the Lambda callback.
 *
 * Example:
 *
 * ```js
 *    // in your Lambda handler file (the one AWS Lambda invokes):
 *    var handler = require('silvermine-lambda-utils/callPromiseFunctionReturnResolvedValueHandler'),
 *        MyService = require('./MyService.js');
 *
 *    module.exports = {
 *       handle: function(evt, context, cb) {
 *          var svc = new MyService(evt.someParameter),
 *              fn = svc.bind(svc, evt.otherParameter, evt.somethingElse);
 *
 *          // Handler will call your service function, and call the callback
 *          // with the whatever value your promise is resolved with (upon success) or the
 *          // thrown error (on failure). Also does minimal logging on completion or
 *          // error.
 *          handler(fn, context, cb);
 *       },
 *    };
 * ```
 *
 * @param function promiseReturningHandlerFn the function to invoke to handle the business
 * logic
 * @param object context the context passed into the Lambda
 * @param function cb the cb passed into the Lambda
 */
module.exports = makeHandler(true);
