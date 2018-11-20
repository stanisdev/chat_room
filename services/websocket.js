const WebSocketServer = require('websocket').server;
const path = require('path');
const jwt = require(path.join(__dirname, 'jwt'));
const config = require(process.env.CONFIG_PATH);

/**
 * Websocket class
 * All client connections are kept in one object "clients".
 * If server is being restarted after that all clients try
 * to connect again and connection for each one should be established.
 */
class Websocket {
  constructor(server) {
    this.server = server;
    this.db = require(config.STORAGES_PATH).getConnection();
    this.clients = {};
  }

  start() {
    this.wsServer = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false,
    });
    this.listen();
  }

  listen() {
    this.wsServer.on('request', async request => {
      let userId;
      try {
        const token = request.resourceURL.query.access_token;
        const { id, personalKey } = await jwt.verify(token);
        const user = await this.db.User.findOneByParams({
          id,
          personal_key: personalKey,
          status: 1,
          blocked: false,
        });
        if (!(user instanceof Object)) {
          throw new Error('Wrong token or user not found');
        }
        userId = id;
        this.clients[userId];
      } catch (err) {
        return request.reject();
      }
      const connection = request.accept(null, request.origin);

      connection.on('message', message => {});
      connection.on('close', message => {
        delete this.clients[userId];
      });
      connection.sendUTF('Hello');
    });
  }
}

module.exports = Websocket;
