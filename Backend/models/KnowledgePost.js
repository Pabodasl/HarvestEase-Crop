const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: String,
  email: String,
  experience: String,
  imagePath: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
