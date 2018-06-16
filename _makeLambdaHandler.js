'use strict';

var Q = require('q');

Q.longStackSupport = true;

module.exports = function(returnResolvedValue) {
   return function(promiseReturningHandlerFn, context, cb) {
      Q.promised(promiseReturningHandlerFn)()
         .then(function(v) {
            // eslint-disable-next-line no-console
            console.log('completed with %s millis left', context.getRemainingTimeInMillis());
            if (returnResolvedValue) {
               return cb(undefined, v);
            }
            return cb();
         })
         .catch(function(err) {
            // eslint-disable-next-line no-console
            console.log('ERROR:', err, err.stack);
            cb(err);
         })
         .done();
   };
};
