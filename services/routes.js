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
      getAll: {
        route: ['/all', 'GET'],
        filters: []
      }
    }
  }
};