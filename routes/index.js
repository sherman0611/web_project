var express = require('express');
var router = express.Router();
var post = require('../models/posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PlantHub' });
});

/* POST create post form. */
router.post('/create-post', function(req, res, next) {
  let postData = req.body;
  let result = post.create(postData);
  console.log(result);
  res.redirect('/');
});

module.exports = router;
