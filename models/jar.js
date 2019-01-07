var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
var JarSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  unlockDate: Date,
  opened: Boolean,
  postCount: Number
});

var Jar = module.exports = mongoose.model('Jar', JarSchema);

module.exports.getJarById = function (jarId, callback) {
  Jar.findById(jarId, (err, jar) => {
    if (err) {
      console.log(err);
      callback(null);
    }
    callback(jar);
  });
}

module.exports.getJarByUser = function (userId, callback) {
  Jar.findOne({'userId' : userId, 'opened' : false}, (err, jar) => {
    if (err) {
      console.log(err);
      callback(null);
    }
    callback(jar);
  });
}

/* expirationTime = in millis */
module.exports.createJar = function (userId, expirationTime, callback) {
  var jar = new Jar();
  jar.userId = userId;
  jar.unlockDate = Date().now() + expirationTime;
  jar.opened = false;
  jar.postCount = 0;
  jar.markModified('unlockDate');
  jar.save((err, doc) => {
    callback(err, doc);
  });
}
