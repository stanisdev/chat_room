const mongoose = require('mongoose');
const statics = {};

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
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

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
