const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, required: true, unique: true },
  password: { type: String, required: true },
}, { minimize: false });

module.exports = mongoose.model('User', UserSchema);

