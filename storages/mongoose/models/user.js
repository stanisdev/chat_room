const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 60,
  },
  email: {
    type: String,
    required: true,
    maxlength: 60,
  },
  password: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60,
  },
  salt: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
  },
  personal_key: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 7,
  },
  status: {
    type: Number,
    required: true,
    deafult: 0, // 0 - not activated, 1 - activated
  },
  blocked: {
    type: Boolean,
    required: true,
    deafult: false,
  },
  last_login: {
    type: Date,
  },
});

userSchema.statics.findOneByParams = function(params, attributes = []) {
  return this.findOne(params);
};

userSchema.statics.createNew = function(params) {
};

mongoose.model('User', userSchema);