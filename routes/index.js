var express = require('express');
var router = express.Router();
var post = require('../models/posts');
const { getAll, getById } = require("../controllers/posts");

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = getAll();
  result.then(posts => {
    let data = JSON.parse(posts);
    // console.log(data.length);
    res.render('index', { title: 'PlantHub', data: data});
  }).catch(err => {
    res.render('error', { error: err});
  });
});

/* POST create post form. */
router.post('/create-post', function(req, res, next) {
  let postData = req.body;
  let result = post.create(postData);
  console.log(result);
  res.redirect('/');
});

/* GET post details page. */
router.get('/post/:id', function(req, res, next) {
  const postId = req.params.id;
  let result = getById(postId);
  result.then(post => {
    if (!post) {
      res.status(404).send('Post not found');
    } else {
      res.render('post', { post: post });
    }
  }).catch(err => {
    res.render('error', { error: err });
  });
});

module.exports = router;
