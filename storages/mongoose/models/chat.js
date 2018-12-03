const mongoose = require('mongoose');
const statics = {};

/**
 * Define schema of chat
 */
const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
  },
  image: {
    type: String,
    maxlength: 150,
  },
  type: {
    type: Number,
    required: true,
    default: 0, // 0 - common chat, 1 - group chat
  },
  members: [
    {
      _id: false,
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
      },
      role: {
        type: Number,
        default: 0, // 0 - common member, 1 - administrator
      },
    },
  ],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

/**
 * Check whether dialog exists among transferred users
 *
 * @async
 * @param {Number} userId
 * @param {Number} interlocutorId
 * @return {Promise<Object>}
 */
statics.checkDialogExistence = async function(userId, interlocutorId) {
  const { chats } = await mongoose.model('User').findOne(
    {
      _id: userId,
    },
    'chats'
  );
  const chat = await this.findOne({
    _id: { $in: chats },
    members: {
      $elemMatch: { user: interlocutorId },
    },
  });
  return {
    exists: chat instanceof Object,
    chat,
  };
};

/**
 * Create new chat with transferred parameters
 *
 * @async
 * @param {Object} params
 * @return {Promise<Object>}
 */
statics.createNew = async function(params) {
  let { members, type, userId } = params;
  members.push(userId);
  members = members.map(memberId => {
    return {
      user: memberId,
    };
  });
  const chat = new this({
    type,
    members,
  });
  await chat.save();
  const tasks = [];
  for (let a = 0; a < members.length; a++) {
    const member = members[a];
    tasks.push(
      this.model('User').updateOne(
        { _id: member.user },
        { $push: { chats: chat._id } }
      )
    );
  }
  await Promise.all(tasks);
  return chat;
};

chatSchema.statics = statics;
mongoose.model('Chat', chatSchema);
