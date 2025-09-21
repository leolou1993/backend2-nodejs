const bucketDict = require("./BucketDict");

class RateLimiter {

    constructor(capacity, leak_rate) {
        if (RateLimiter.instance) {
            return RateLimiter.instance;
        }
        this._capacity = capacity;
        this._leak_rate = leak_rate;  
        RateLimiter.instance = this;
    }

    static create_rate_limiter(capacity, leak_rate) {
    // Creates a new rate limiter
    // capacity: maximum bucket size
    // leak_rate: units leaked per second
        if (!RateLimiter._instance) {
            RateLimiter._instance = new RateLimiter(capacity, leak_rate);
        }
        return RateLimiter._instance;
    }

    get_capacity() {
    // Returns the capacity of the rate limiter
        return this._capacity;
    }

    get_leak_rate() {
    // Returns the leak rate of the rate limiter
        return this._leak_rate;
    }
    

    get_limiter_state() {
    // Returns current limiter configuration for debugging
    // Returns: {capacity, leak_rate}
        return {
            capacity: this._capacity,
            leak_rate: this._leak_rate
        };
    }


    get_bucket_state(limiter, user_id) {
    // Returns current bucket information for debugging
    // Returns: bucket_info or null if user doesn't exist
        const bucket = bucketDict[user_id];
        if (!bucket) {
            return null; // User does not exist
        }
        return bucket.get_bucket_info();
    }

}

module.exports = RateLimiter;