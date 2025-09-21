const Bucket = require('./Bucket');
const RateLimiter  = require('./RateLimiter');
const bucketDict = require('./BucketDict');


const rateLimiter = RateLimiter.create_rate_limiter(5, 1); 
// capacity 5, leak rate 1 per second

console.log("Rate Limiter State:", rateLimiter.get_limiter_state());

let bucketMap = bucketDict

const new_user_id = 'user1';
let bucket1 = new Bucket(5, 1, new_user_id);

bucketMap[new_user_id] = bucket1;

console.log("bucket map:", bucketMap);

// for( let i = 0; i < 5; i++ ) {
//   window.setTimeout(function() {
//     console.log(i);
//   }, 1000 * i);
// }