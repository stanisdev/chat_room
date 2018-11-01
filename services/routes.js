module.exports = {
  messages: {
    namespace: '/messages',
    handlers: {
      getAll: {
        route: ['/:chat_id', 'GET'],
        filters: ['chats.isMember'],
      },
      create: {
        route: ['/:chat_id', 'POST'],
        filters: ['chats.isMember'],
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
      },
      addMember: {
        route: ['/:chat_id/add_member/:user_id', 'GET'],
        filters: ['users.doesExist', 'users.isActive', 'chats.canAddMember'],
        validators: ['chats.id', 'users.id'],
      },
    },
  },
  users: {
    namespace: '/users',
    handlers: {
      login: {
        route: ['/login', 'POST'],
        validators: ['users.login'],
        noAuth: true,
      },
      register: {
        route: ['/register', 'POST'],
        validators: ['users.register'],
        filters: ['users.doesEmailExist'],
        noAuth: true,
      },
      confirmEmail: {
        route: ['/confirm_email/:key', 'GET'],
        validators: ['users.confirmEmail'],
        filters: ['users.confirmEmailKeyExpired'],
        noAuth: true,
      },
    },
  },
};
