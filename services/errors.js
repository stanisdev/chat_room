const status = require('http-status');

module.exports = (app) => {
  /**
   * 404
   */
  app.use((req, res, next) => {
    res.status(status.NOT_FOUND).json({});
  });

  /**
   * 500
   */
  app.use((err, req, res, next) => {
    console.log(err.stack);
    let response = {};
    if (process.env.NODE_ENV === 'development') {
      response = {
        error: err.toString(),
        stack: err.stack.toString().split('\n').map((msg) => msg.trim()),
      };
    }
    res.status(status.INTERNAL_SERVER_ERROR).json(response);
  });
};