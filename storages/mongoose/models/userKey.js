const mongoose = require('mongoose');
const statics = {};

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

statics.findOneByParams = function(params) {
  return this.findOne(params);
};

userKeySchema.statics = statics;
mongoose.model('UserKey', userKeySchema);
