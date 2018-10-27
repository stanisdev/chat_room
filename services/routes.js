module.exports = {
  messages: {
    namespace: '/messages',
    handlers: {
      getAll: {
        route: ['/:chat_id', 'GET'],
        filters: ['chats.isChatMember'],
      },
      create: {
        route: ['/:chat_id', 'POST'],
        filters: ['chats.isChatMember'],
        validators: ['chats.id', 'messages.create'],
      },
    },
  },
  chats: {
    namespace: '/chats',
    handlers: {
      create: {
        route: ['/', 'POST'],
        validators: ['chats.create'],
        filters: [],
      },
      getAll: {
        route: ['/', 'GET'],
        filters: [],
        // noAuth: true,
      },
    },
  },
};
