module.exports = {
  messages: {
    namespace: '/messages',
    handlers: {
      getAll: {
        route: ['/all', 'GET'],
        filters: []
      },
      create: {
        route: ['/:chat_id', 'POST'],
        filters: ['chats.isChatMember'],
        validators: ['chats.id', 'messages.create'],
      }
    }
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
        route: ['/all', 'GET'],
        filters: [],
        // noAuth: true,
      }
    }
  }
};