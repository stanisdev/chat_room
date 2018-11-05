const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String
});

mongoose.model('User', userSchema);