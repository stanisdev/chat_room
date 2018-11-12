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
  members_count: {
    type: Number,
    default: 2,
    required: true,
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

statics.checkDialogExistence = function() {};

statics.createNew = async function(params) {
  let { members, type } = params;
  members = members.map(member => {
    return {
      user: member,
    };
  });
  const chat = new this({
    type,
    members_count: members.length,
    members,
  });
  const { _id } = await chat.save();
  const tasks = [];
  for (let a = 0; a < members.length; a++) {
    const member = members[a];
    tasks.push(
      this.model('User').updateOne(
        { _id: member.user },
        { $push: { chats: _id } },
      )
    );
  }
  return Promise.all(tasks);
};

chatSchema.statics = statics;
mongoose.model('Chat', chatSchema);
