var express = require('express');
var router = express.Router();
var controller = require('controllers/jar');

router.get('/jar', controller.getJar);
router.post('/jar', controller.createJar);
router.delete('/jar', controller.deleteJar);
router.post('/jar/open', controller.openJar);


router.post('/jar/post', controller.addPostToJar);
router.delete('/jar/post', controller.deletePostFromJar);
router.get('/jar/post/all', controller.getPostsFromJar);

module.exports = router;
