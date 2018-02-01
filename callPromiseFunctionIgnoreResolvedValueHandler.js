'use strict';

var Q = require('q');

/**
 * Properly converts a function that returns a promise into a handler for a
 * Lambda function. Ignores any response / value that the promise is resolved
 * with.
 *
 * Example:
 *
 * ```js
 *    // in your Lambda handler file (the one AWS Lambda invokes):
 *    var handler = require('silvermine-lambda-utils/callPromiseFunctionIgnoreResolvedValueHandler'),
 *        MyService = require('./MyService.js');
 *
 *    module.exports = {
 *       handle: function(evt, context, cb) {
 *          var svc = new MyService(evt.someParameter),
 *              fn = svc.bind(svc, evt.otherParameter, evt.somethingElse);
 *
 *          // Handler will call your service function, and call the callback
 *          // with either nothing (upon success) or the thrown error (on failure)
 *          // Also does minimal logging on completion or error.
 *          handler(fn, context, cb);
 *       },
 *    };
 * ```
 *
 * @param function promiseReturningHandlerFn the function to invoke to handle the business logic
 * @param object context the context passed into the Lambda
 * @param function cb the cb passed into the Lambda
 */
module.exports = function(promiseReturningHandlerFn, context, cb) {
   Q.promised(promiseReturningHandlerFn)()
      .then(function() {
         // eslint-disable-next-line no-console
         console.log('completed with %s millis left', context.getRemainingTimeInMillis());
         cb();
      })
      .catch(function(err) {
         // eslint-disable-next-line no-console
         console.log('ERROR:', err, err.stack);
         cb(err);
      })
      .done();
};
