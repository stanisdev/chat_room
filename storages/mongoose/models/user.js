const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const config = require(process.env.CONFIG_PATH);
const statics = {};

/**
 * Define schema of user
 */
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
    default: 0, // 0 - not activated, 1 - activated
  },
  blocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  chats: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat',
    },
  ],
  last_login: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

/**
 * Virtual field "id"
 */
userSchema.virtual('id').get(function() {
  return this._id;
});

/**
 * Find one user by filter parameters
 *
 * @async
 * @param {Object} params
 * @param {Array} attributes=[]
 * @return {Promise<Object>}
 */
statics.findOneByParams = function(params, attributes = []) {
  attributes = ['_id', 'name', 'email', 'status', 'blocked']
    .concat(attributes)
    .join(' ');
  return this.findOne(mongoose.beautifyId(params)).select(attributes);
};

/**
 * Create new user
 *
 * @async
 * @param {Object} params
 * @return {Promise<Object>}
 */
statics.createNew = async function(params) {
  const { email, name, password } = params;
  const salt = randomString.generate(8);
  const hash = await bcrypt.hash(password + salt, 10);
  const expired =
    new Date().getTime() + config.USER_EMAIL_CONFIRMATION_KEY.EXPIRATION;
  const key = randomString.generate(config.USER_EMAIL_CONFIRMATION_KEY.LENGTH);

  const user = new this({
    name,
    email,
    password: hash,
    salt,
    personal_key: randomString.generate(7),
  });
  await user.save();

  const UserKey = this.model('UserKey');
  const userKey = new UserKey({
    user_id: user.id,
    key,
    expired,
  });
  await userKey.save();
  return true;
};

/**
 * Check password correctness with bcrypt
 *
 * @async
 * @param {Object} params
 * @return {Promise<Boolean>}
 */
statics.checkPassword = function(params) {
  const { password, hash, salt } = params;
  return bcrypt.compare(password + salt, hash);
};

/**
 * To log time when user logged in
 *
 * @async
 * @param {Number} userId
 * @return {Promise}
 */
statics.updateLastLogin = function(userId) {
  return this.updateOne(
    { _id: userId },
    {
      $set: {
        last_login: new Date(),
      },
    }
  );
};

/**
 * Confirm user's email
 *
 * @async
 * @param {Object} params
 * @return {Promise}
 */
statics.confirmEmail = function(params) {
  const { keyId, userId } = params;
  const UserKey = this.model('UserKey');
  return Promise.all([
    this.updateOne(
      { _id: userId },
      {
        $set: {
          status: 1,
        },
      }
    ),
    UserKey.deleteOne({
      _id: keyId,
    }),
  ]);
};

/**
 * To count amount of user by filter parameters
 *
 * @async
 * @param {Object} params
 * @return {Promise<Number>}
 */
statics.countByParams = function(params) {
  if (params.hasOwnProperty('id')) {
    params._id = params.id;
    delete params.id;
  }
  return this.find(params).countDocuments();
};

userSchema.statics = statics;
mongoose.model('User', userSchema);
