const config = require(process.env.CONFIG_PATH);

module.exports = {
  limiter(req) {
    const limitDefault = config.MESSAGES_PER_PAGE;
    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    if (isNaN(limit) || limit > limitDefault) {
      limit = limitDefault;
    }
    if (isNaN(offset)) {
      offset = 0;
    }
    return {
      limit,
      offset,
    };
  },
};
