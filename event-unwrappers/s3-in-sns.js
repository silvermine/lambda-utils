'use strict';

var _ = require('underscore');

/**
 * Converts an SNS event that contains S3 events as its message into a list of
 * objects representing each S3 item included in the message(s).
 *
 * Format of each S3 event object returned by this function:
 * {
 *    region: 'us-east-1',
 *    time: '2017-02-27T23:16:36.367Z',
 *    name: 'ObjectCreated:Put',
 *    bucket: { // whatever is passed in the raw S3 message bucket object
 *       name: 'some-bucket-name',
 *       arn: 'arn:....:some-bucket-name',
 *       ownerIdentity: { principalId: 'ABCDEFGHIJ' },
 *    },
 *    object: { // whatever is passed in the raw S3 message object object
 *       key: 'the-s3-object-key.foo',
 *       size: 1234, // file size
 *       eTag: '2g4d34e9e7g513geg542958891434e1e',
 *       versionId: '6CSRvM11Ku9dnTY4TgHdOP1tG1XYo1jj',
 *       sequencer: '1158G4B16A1FC5422D'
 *    },
 * }
 *
 * @param object evt the event that your Lambda function was invoked with
 * @return array of simplified events, one event for each S3 event in the message(s)
 */
module.exports = function(evt) {
   return _.chain(evt.Records)
      .map(function(snsRecord) {
         if (snsRecord.EventSource !== 'aws:sns') {
            throw new Error('The event must come from SNS, but appears to come from ' + snsRecord.EventSource);
         }

         return JSON.parse(snsRecord.Sns.Message);
      })
      .pluck('Records')
      .flatten()
      .map(function(s3Record) {
         if (s3Record.eventSource !== 'aws:s3') {
            throw new Error('The messages in the event must come from S3, but appear to come from ' + s3Record.eventSource);
         }

         return {
            region: s3Record.awsRegion,
            time: s3Record.eventTime,
            name: s3Record.eventName,
            bucket: s3Record.s3.bucket,
            object: s3Record.s3.object,
         };
      })
      .value();
};
