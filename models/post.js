var mongoose = require('mongoose');
const utils = require('../utils/postutils');
const Schema = mongoose.Schema;

// User Schema
var PostSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  jarId: {
    type: Schema.Types.ObjectId,
    ref: 'Jar'
  },
  postDate: Date,
  postType: Number, /* 1. Text, 2. Image, 3. Video */
  content: String
});

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPostById = function (postId, callback) {
  Post.findById(postId, (err, post) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, post);
  });
}

module.exports.getPostByJar = function (jarId, callback) {
  Post.find({'jarId': jarId}, (err, posts) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, posts);
  });
}

module.exports.getPostsByUser = function (userId, callback) {
  Post.findOne({'userId' : userId}, (err, posts) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, posts);
  });
}

module.exports.getPostsByUserAndJar = function (userId, jarId, callback) {
  Post.findOne({'userId' : userId, 'jarId': jarId}, (err, posts) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, posts);
  });
}

/* expirationTime = in millis */
module.exports.createPost = function (userId, jarId, postType, content, callback) {
  var post = new Post();
  post.userId = userId;
  post.postDate = Date().now();
  post.type = utils.getPostType(postType);
  post.postCount = 0;
  post.markModified('postDate');
  post.save((err, doc) => {
    callback(err, doc);
  });
}
