module.exports = {
  messages: {
    namespace: '/messages',
    handlers: {
      getAll: {
        route: ['/all', 'GET'],
        filters: []
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