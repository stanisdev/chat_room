const mongoose = require('mongoose');
const statics = {};

/**
 * Define schema of messages of chats
 */
const messageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  chat_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Chat',
  },
  statuses: [
    {
      _id: false,
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
      },
      value: {
        type: Number,
        default: 0, // 0 - not delivired, 1 - delivired, 2 - has been readed
      },
    },
  ],
  type: {
    type: Number,
    required: true,
    default: 0, // 0 - text/plain
  },
  content: {
    type: String,
    required: true,
  },
  edited: {
    type: Boolean,
  },
  quote_for: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message',
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

/**
 * Create new message of chat with transferred parameters
 *
 * @async
 * @param {Object} params
 * @return {Promise<Object>}
 */
statics.createNew = async function(params) {
  const { chatId, content, type } = params;
  const userId = params.userId.toString();
  const { members } = await mongoose.model('Chat').findById(chatId, 'members');
  const statuses = members.map(member => {
    const user = member.user.toString();
    const status = {
      user,
      value: 0,
    };
    if (user === userId) {
      status.value = 2;
    }
    return status;
  });
  const message = new this({
    user_id: userId,
    chat_id: chatId,
    statuses,
    type,
    content,
  });
  message.save();
  return { message, members };
};

/**
 * Find list of messages of chat with transferred parameters
 *
 * @async
 * @param {Object} params
 * @return {Promise<Array[Object]>}
 */
statics.findAllByChat = async function(params) {
  const { userId, chatId, limit, offset } = params;
  const messages = await this.aggregate([
    {
      $match: {
        statuses: {
          $elemMatch: { user: userId },
        },
        chat_id: chatId,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        type: 1,
        content: 1,
        edited: 1,
        quote_for: 1,
        statuses: {
          $filter: {
            input: '$statuses',
            as: 'status',
            cond: { $eq: ['$$status.user', userId] },
          },
        },
        'user._id': 1,
        'user.name': 1,
      },
    },
    {
      $unwind: '$user',
    },
    {
      $unwind: '$statuses',
    },
  ])
    .skip(offset)
    .limit(limit);

  return messages;
};

messageSchema.statics = statics;
mongoose.model('Message', messageSchema);
