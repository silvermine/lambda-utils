'use strict';

var expect = require('expect.js'),
    unwrapper = require('../../event-unwrappers/s3-in-sns'),
    SAMPLE_EVENT;

SAMPLE_EVENT = {
   Records: [
      {
         EventSource: 'aws:sns',
         EventVersion: '1.0',
         EventSubscriptionArn: 'arn:aws:sns:us-east-1:1234567890:some-topic-name:08d701fa-2d0d-432e-9a21-ea3986e31223',
         Sns: {
            Type: 'Notification',
            MessageId: 'bc37cd54-0279-4e97-8727-2facae3817d3',
            TopicArn: 'arn:aws:sns:us-east-1:1234567890:some-topic-name',
            Subject: 'Amazon S3 Notification',
            // eslint-disable-next-line max-len
            Message: '{"Records":[{"eventVersion":"2.0","eventSource":"aws:s3","awsRegion":"us-east-1","eventTime":"2017-02-27T23:19:31.970Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"AWS:ABCDEFGHIJKLMNOPQRSTUV:cli"},"requestParameters":{"sourceIPAddress":"8.8.8.8"},"responseElements":{"x-amz-request-id":"ABCDEFGHIJK123","x-amz-id-2":"ABCDEFGHJKLMNOPQRSTUV"},"s3":{"s3SchemaVersion":"1.0","configurationId":"8c9d1f41-bdd8-42be-a2ab-6a0a98b29b21","bucket":{"name":"some-bucket-name","ownerIdentity":{"principalId":"ABCDEFGHIJKL"},"arn":"arn:aws:s3:::some-bucket-name"},"object":{"key":"some-object-key-1.foo","size":1539,"eTag":"f51f20b3552d4293ba39d836a31b49a1","versionId":"3019dda287184f33944042866943875a","sequencer":"0e042b98180d"}}}]}',
            Timestamp: '2017-02-27T23:19:32.053Z',
            SignatureVersion: '1',
            Signature: 'Bt/ABCDEFGH==',
            SigningCertUrl: 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-874eba81258f454ba8bf74bf476a6f4f.pem',
            UnsubscribeUrl: 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:1234567890:some-topic-name:08d701fa-2d0d-432e-9a21-ea3986e31223',
            MessageAttributes: {},
         },
      },
      {
         EventSource: 'aws:sns',
         EventVersion: '1.0',
         EventSubscriptionArn: 'arn:aws:sns:us-east-1:1234567890:some-topic-name:08d701fa-2d0d-432e-9a21-ea3986e31223',
         Sns: {
            Type: 'Notification',
            MessageId: 'bc37cd54-0279-4e97-8727-2facae3817d3',
            TopicArn: 'arn:aws:sns:us-east-1:1234567890:some-topic-name',
            Subject: 'Amazon S3 Notification',
            // eslint-disable-next-line max-len
            Message: '{"Records":[{"eventVersion":"2.0","eventSource":"aws:s3","awsRegion":"us-east-1","eventTime":"2017-02-27T23:19:31.970Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"AWS:ABCDEFGHIJKLMNOPQRSTUV:cli"},"requestParameters":{"sourceIPAddress":"8.8.8.8"},"responseElements":{"x-amz-request-id":"ABCDEFGHIJK123","x-amz-id-2":"ABCDEFGHJKLMNOPQRSTUV"},"s3":{"s3SchemaVersion":"1.0","configurationId":"8c9d1f41-bdd8-42be-a2ab-6a0a98b29b21","bucket":{"name":"some-bucket-name","ownerIdentity":{"principalId":"ABCDEFGHIJKL"},"arn":"arn:aws:s3:::some-bucket-name"},"object":{"key":"some-object-key-2.foo","size":1539,"eTag":"f51f20b3552d4293ba39d836a31b49a1","versionId":"3019dda287184f33944042866943875a","sequencer":"0e042b98180d"}}},{"eventVersion":"2.0","eventSource":"aws:s3","awsRegion":"us-east-1","eventTime":"2017-02-27T23:19:31.970Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"AWS:ABCDEFGHIJKLMNOPQRSTUV:cli"},"requestParameters":{"sourceIPAddress":"8.8.8.8"},"responseElements":{"x-amz-request-id":"ABCDEFGHIJK123","x-amz-id-2":"ABCDEFGHJKLMNOPQRSTUV"},"s3":{"s3SchemaVersion":"1.0","configurationId":"8c9d1f41-bdd8-42be-a2ab-6a0a98b29b21","bucket":{"name":"some-bucket-name","ownerIdentity":{"principalId":"ABCDEFGHIJKL"},"arn":"arn:aws:s3:::some-bucket-name"},"object":{"key":"some-object-key-3.foo","size":1539,"eTag":"f51f20b3552d4293ba39d836a31b49a1","versionId":"3019dda287184f33944042866943875a","sequencer":"0e042b98180d"}}}]}',
            Timestamp: '2017-02-27T23:19:32.053Z',
            SignatureVersion: '1',
            Signature: 'Bt/ABCDEFGH==',
            SigningCertUrl: 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-874eba81258f454ba8bf74bf476a6f4f.pem',
            UnsubscribeUrl: 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:1234567890:some-topic-name:08d701fa-2d0d-432e-9a21-ea3986e31223',
            MessageAttributes: {},
         },
      },
   ],
};

describe('event-unwrappers/s3-in-sns', function() {

   it('unwraps events as expected', function() {
      var resp = unwrapper(SAMPLE_EVENT);

      expect(resp).to.eql([
         {
            region: 'us-east-1',
            time: '2017-02-27T23:19:31.970Z',
            name: 'ObjectCreated:Put',
            bucket: {
               name: 'some-bucket-name',
               ownerIdentity: { principalId: 'ABCDEFGHIJKL' },
               arn: 'arn:aws:s3:::some-bucket-name',
            },
            object: {
               key: 'some-object-key-1.foo',
               size: 1539,
               eTag: 'f51f20b3552d4293ba39d836a31b49a1',
               versionId: '3019dda287184f33944042866943875a',
               sequencer: '0e042b98180d',
            },
         },
         {
            region: 'us-east-1',
            time: '2017-02-27T23:19:31.970Z',
            name: 'ObjectCreated:Put',
            bucket: {
               name: 'some-bucket-name',
               ownerIdentity: { principalId: 'ABCDEFGHIJKL' },
               arn: 'arn:aws:s3:::some-bucket-name',
            },
            object: {
               key: 'some-object-key-2.foo',
               size: 1539,
               eTag: 'f51f20b3552d4293ba39d836a31b49a1',
               versionId: '3019dda287184f33944042866943875a',
               sequencer: '0e042b98180d',
            },
         },
         {
            region: 'us-east-1',
            time: '2017-02-27T23:19:31.970Z',
            name: 'ObjectCreated:Put',
            bucket: {
               name: 'some-bucket-name',
               ownerIdentity: { principalId: 'ABCDEFGHIJKL' },
               arn: 'arn:aws:s3:::some-bucket-name',
            },
            object: {
               key: 'some-object-key-3.foo',
               size: 1539,
               eTag: 'f51f20b3552d4293ba39d836a31b49a1',
               versionId: '3019dda287184f33944042866943875a',
               sequencer: '0e042b98180d',
            },
         },
      ]);
   });

   it('throws an error when the top-level event is not from SNS', function() {
      var sample = JSON.parse(JSON.stringify(SAMPLE_EVENT));

      sample.Records[1].EventSource = 'not-sns';

      expect(unwrapper.bind(null, sample)).to.throwError();
   });

   it('throws an error when the embedded S3 events are not from S3', function() {
      var sample = JSON.parse(JSON.stringify(SAMPLE_EVENT));

      sample.Records[1].Sns.Message = sample.Records[1].Sns.Message.replace('"eventSource":"aws:s3"', '"eventSource":"aws:not-s3"');

      expect(unwrapper.bind(null, sample)).to.throwError();
   });

});
