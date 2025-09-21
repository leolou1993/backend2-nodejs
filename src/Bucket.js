const bucketDict = require('../src/BucketDict');


class Bucket {
    
    constructor(user_id) {
        // this._capacity = capacity;
        this._user_id = user_id;
        this._current_amount = 0;
        this._last_updated = null;
    }

    leak(limiter, current_timestamp) {

        const time_elapsed = current_timestamp - this._last_updated;
        const amount_to_leak = time_elapsed * limiter.get_leak_rate();
        this._current_amount = Math.max(0, this._current_amount - amount_to_leak);
        this._last_updated = current_timestamp;
    }

    get_current_amount() {
        return this._current_amount;
    }

    get_last_updated() {
        return this._last_updated;
    }

    get_user_id() {
        return this._user_id;
    }   

    get_bucket_info() {
        return {
            user_id: this._user_id,
            current_amount: this._current_amount,
            last_updated: this._last_updated
        };
    }

    set_current_amount(amount) {
        this._current_amount = amount;
    }

    set_last_updated(timestamp) {
        this._last_updated = timestamp;
    }
    set_user_id(user_id) {
        this._user_id = user_id;
    }

    allow_request(limiter, user_id, timestamp) {
    // Determines if a request should be allowed
    // Returns: [boolean_allowed, new_limiter_state]
        const bucket = bucketDict.getBucket(user_id);
        let result = null
        if (!bucket) {
            result =  [false, null]; // User does not exist
        }
        else {
            bucket.leak(limiter, timestamp);
            
            if( bucket.get_current_amount() >= limiter.get_capacity() ) {
            console.log("burst detected");

                result = [false, bucketDict.getBucketDict()]; // Request rejected
            }
            else {
                this._current_amount++;
                result = [true, bucketDict.getBucketDict()];
            }
            
        }
        return result;  
    }
}

// Export the class so it can be imported in other files
module.exports = Bucket;