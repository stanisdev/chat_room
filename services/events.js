const EventEmitter = require('events');

const ee = new EventEmitter();

module.exports = {
  emit(event, data) {
    ee.emit(event, data);
  },
  on(event, cb) {
    ee.on(event, cb);
  },
};
