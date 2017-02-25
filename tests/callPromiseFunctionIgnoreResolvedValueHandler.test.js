'use strict';

var _ = require('underscore'),
    Q = require('q'),
    sinon = require('sinon'),
    expect = require('expect.js'),
    rewire = require('rewire'),
    handler = rewire('../callPromiseFunctionIgnoreResolvedValueHandler');

describe('callPromiseFunctionIgnoreResolvedValueHandler', function() {
   var context = { getRemainingTimeInMillis: _.noop },
       revert;

   beforeEach(function() {
      revert = handler.__set__({
         console: { log: _.noop },
      });
   });

   afterEach(function() {
      revert();
   });

   it('calls the function and ignores its return value', function(done) {
      var fn = sinon.stub(),
          cb;

      fn.returns(Q.delay('response', 3));

      cb = function(err, resp) {
         sinon.assert.calledOnce(fn);
         expect(err).to.be(undefined);
         expect(resp).to.be(undefined);
         done();
      };

      handler(fn, context, cb);
   });

   it('calls the callback with any error that is thrown', function(done) {
      var expectedErr = new Error('ExpectedThisError'),
          fn, cb;

      fn = function() {
         var def = Q.defer();

         setTimeout(function() {
            def.reject(expectedErr);
         }, 3);

         return def.promise;
      };

      cb = function(err, resp) {
         expect(expectedErr).to.be(err);
         expect(resp).to.be(undefined);
         done();
      };

      handler(fn, context, cb);
   });

});
