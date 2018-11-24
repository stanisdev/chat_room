const mongoose = require('mongoose');
const statics = {};

/**
 * Define schema of keys of users
 */
const userKeySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  key: {
    type: String,
    minlength: 1,
  },
  expired: {
    type: Date,
  },
});

/**
 * Find one key of user by filter parameters
 *
 * @async
 * @param {Object} params
 * @return {Promise<Object>}
 */
statics.findOneByParams = function(params) {
  return this.findOne(params);
};

userKeySchema.statics = statics;
mongoose.model('UserKey', userKeySchema);
