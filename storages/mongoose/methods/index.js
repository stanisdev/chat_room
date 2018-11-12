const mongoose = require('mongoose');

mongoose.beautifyId = function(object) {
  if (!(object instanceof Object) || !('id' in object)) {
    return object;
  }
  const idValue = object.id;
  delete object.id;
  object._id = idValue;
  return object;
};
