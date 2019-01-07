const User = require('models/user');
const Jar = require('models/jar');
const Post = require('model/post');
const postUtils = require('../utils/postutils');

var functions = {

  getJar: function (req, res) {
    const userId = req.query.userId;
    const jarId = req.query.jarId;
    if (userId == null) {
      res.json({error: 'UserId is required'});
      return;
    }
    if (jarId == null) {
      Jar.getJarById(jarId, (jar) => {
        if (jar == null) {
          res.json({error: 'Jar does not exist'});
          return;
        } else {
          res.json({'jar': jar});
          return;
        }
      });
    } else {
      Jar.getJarByUser(UserId, (jar) => {
        if (jar == null) {
          res.json({error: 'Jar does not exist'});
          return;
        } else {
          res.json({'jar': jar});
          return;
        }
      });
    }
  },



/* expirationTime = in millis */
  createJar: function (req, res) {
    const userId = req.query.userId;
    const expirationTime = req.query.expirationTime;
    Jar.getJarByUser(userId, (jar) => {
      if (jar != null) {
        res.json({ error: 'You can only have one unopened jar at a time.'});
        return;
      }
      addJar();
    })

    function addJar() {
      Jar.createJar(userId, expirationTime, (err, jar) => {
        if(err) {
          res.json({error: err.message});
          return;
        }
        if (jar == null) {
          res.json({error: 'Could not creat jar. Please try again'});
          return;
        }
        res.json({message:'Jar created.', jar: jar});
      })
    }
  },

  deleteJar: function (req, res) {
    const userId = req.query.userId;
    const jarId = req.query.jarId;
    Jar.getJarById(jarId, (jar) => {
      if (jar == null) {
        res.json({error: 'Jar does not exist.'});
        return;
      }
      if (jar.userId != userId) {
        res.json({error: 'Jar does not belong to specified user.'});
        return;
      }
      deletePosts();
    });

    function deletePosts() {
      Post.deletePostsByJarId(jarId, (err, posts) => {
        if (err) {
          res.json({error: err.message});
          return;
        }
        deleteUserJar();
      });
    }

    function deleteUserJar() {
      Jar.deleteJar(jarId, (err, jar) => {
        if (err) {
          res.json({error: err.message});
          return;
        }
        res.json({message: 'Jar deleted', jar: jar});
      });
    }
  },

  openJar: function (req, res) {
    const userId = req.query.userId;
    const jarId = req.query.jarId;
    if (userId == null) {
      res.json({error: 'UserId is required'});
      return;
    }
    if (jarId == null) {
      res.json({error: 'JarId is required'});
      return;
    }
    Jar.openjar(jarId, (err, jar) => {
      if (err) {
        res.json({error: err.message});
        return;
      }
      if (!jar) {
        res.json({error: 'Jar does not exist'});
        return;
      }
      getPosts(jar);
    })

    function getPosts(jar) {
      Post.getPostsByJar(jar._id, (err, posts) => {
        if (err) {
          res.json({error: err.message});
          return;
        }
        if (!posts) {
          res.json({error: 'Posts do not exist'});
          return;
        }
        res.json({jar: jar, posts: posts});
      });
    }
  }
}



module.exports = functions;
