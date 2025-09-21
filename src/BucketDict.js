const bucketDict = {};

function addBucket(user_id, bucket) {
    bucketDict[user_id] = bucket;
}

function getBucket(user_id) {
    return bucketDict[user_id];
}

function removeBucket(user_id) {
    delete bucketDict[user_id];
}
function getBucketDict() {
    return bucketDict;
}


module.exports = {
  addBucket,
  getBucket,
  removeBucket,
  getBucketDict
};