const Bucket = require('../src/Bucket');
const RateLimiter  = require('../src/RateLimiter');
const bucketDict = require('../src/BucketDict');
const chai = require('chai');
const expect = chai.expect;

describe('test for burst handling', () => {
  it('multiple rapid requests at the same time that should be rejected', () => {
    const limiter = RateLimiter.create_rate_limiter(3, 1); // capacity = 3, 1 token/sec
    const userId = 'user1';
    const nowInSec = Date.now()/ 1000; ;

    let bucket1 = new Bucket(userId);
    bucketDict.addBucket(userId, bucket1);

    const expected = [true, bucketDict.getBucketDict()];
    const burst = [false, bucketDict.getBucketDict()];

    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 1st
    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 2nd
    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 3rd
    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(burst); // 4th - should be rejected
  });
});

describe('Time-based leaking ', () => {
  it('Requests separated by time should be allowed after 1 second', () => {
    const limiter = RateLimiter.create_rate_limiter(3, 1); // capacity = 3, 1 token/sec
    const userId = 'user1';
    const nowInSec = Date.now()/ 1000;


    // const new_user_id = 'user1';
    let bucket1 = new Bucket(userId);
    bucketDict.addBucket(userId, bucket1);

    // console.log(bucket1.allow_request(limiter, userId, now));
    const expected = [true, bucketDict.getBucketDict()];

    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 1st
    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 2nd
    expect(bucket1.allow_request(limiter, userId, nowInSec)).deep.equal(expected);  // 3rd
    expect(bucket1.allow_request(limiter, userId, nowInSec+1)).deep.equal(expected); // 4th - should be rejected
  });
});

describe('Multiple users', () => {
  it('Independent bucket behavior', () => {
    const limiter = RateLimiter.create_rate_limiter(3, 1); // capacity = 3, 1 token/sec
    const userId1 = 'user1';
    const userId2 = 'user2';

    const nowInSec = Date.now()/ 1000;


    let bucket1 = new Bucket(userId1);
    bucketDict.addBucket(userId1, bucket1);
    let bucket2 = new Bucket(userId2);

    bucketDict.addBucket(userId2, bucket2);


    // console.log(bucket1.allow_request(limiter, userId, now));
    const expected = [true, bucketDict.getBucketDict()];
    const burst = [false, bucketDict.getBucketDict()];

    expect(bucket1.allow_request(limiter, userId1, nowInSec)).deep.equal(expected);  // userId1 - 1st 
    expect(bucket1.allow_request(limiter, userId1, nowInSec)).deep.equal(expected);  // userId1 - 2nd
    expect(bucket1.allow_request(limiter, userId1, nowInSec)).deep.equal(expected);  // userId1 - 3rd
    expect(bucket1.allow_request(limiter, userId1, nowInSec)).deep.equal(burst); // userId1 - 4th - should be rejected

    expect(bucket1.allow_request(limiter, userId2, nowInSec)).deep.equal(expected); // userId2 - 1th

  });
});