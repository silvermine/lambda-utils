'use strict';

var _ = require('underscore'),
    Q = require('q'),
    sinon = require('sinon'),
    expect = require('expect.js'),
    rewire = require('rewire'),
    makeHandler = rewire('../_makeLambdaHandler');

_.each([ true, false ], function(returns) {

   var name = 'callPromiseFunction' + (returns ? 'Return' : 'Ignore') + 'ResolvedValueHandler',
       verb = (returns ? 'returns' : 'ignores'),
       context = { getRemainingTimeInMillis: _.noop },
       handler, revert;

   beforeEach(function() {
      revert = makeHandler.__set__({
         console: { log: _.noop },
      });
   });

   afterEach(function() {
      revert();
   });

   function runTest(done) {
      var fn = sinon.stub(),
          cb;

      fn.returns(Q.delay('response', 3));

      cb = function(err, resp) {
         sinon.assert.calledOnce(fn);
         expect(err).to.be(undefined);
         expect(resp).to.be(returns ? 'response' : undefined);
         done();
      };

      handler(fn, context, cb);
   }

   describe(name, function() {
      handler = require('../' + name); // eslint-disable-line global-require

      it('works as expected', runTest);
   });

   describe('_makeLambdaHandler(' + returns + ')', function() {
      beforeEach(function() {
         handler = makeHandler(returns);
      });

      it('calls the function and ' + verb + ' its return value', runTest);

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

      it('handles an error, even when the error is thrown without a promise being returned', function(done) {
         var expectedErr = new Error('ExpectedThisError'),
             fn, cb;

         fn = function() {
            throw expectedErr;
         };

         cb = function(err, resp) {
            expect(expectedErr).to.be(err);
            expect(resp).to.be(undefined);
            done();
         };

         handler(fn, context, cb);
      });

   });

});
