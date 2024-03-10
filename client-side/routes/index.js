var express = require('express');
var router = express.Router();
const posts = require("../controllers/posts");
const comments = require("../controllers/comments");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    filename = Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
let upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = posts.getAll();
  result.then(posts => {
    let data = JSON.parse(posts);
    res.render('index', { title: 'PlantHub', data: data});
  }).catch(err => {
    res.render('error', { error: err});
  });
});

/* GET create post page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create post' });
});

/* POST create post form. */
router.post('/create', upload.single('image_file'), function(req, res, next) {
  let postData = req.body;
  let filePath = req.file ? req.file.path : null;

  fetch('http://localhost:3001/create', {
    method: 'post',
    body: JSON.stringify({
      postData: postData,
      filePath: filePath
    }),
    headers: {'Content-Type': 'application/json'},
  }).then(r => {
    r.json()
        .then(json => {
          res.redirect('/');
        })
        .catch(err => {
          console.log('Failed to create post');
        });
  });
});

/* GET post details page. */
router.get('/post/:id', function(req, res, next) {
  const postId = req.params.id;

  let postPromise = posts.getById(postId);
  let commentsPromise = comments.getAllByPostId(postId);
  // let commentsPromise = comments.getAll();

  Promise.all([postPromise, commentsPromise]).then(([post, comments]) => {
    if (!post) {
      res.status(404).send('Post not found');
    } else {
      console.log(comments);
      let postData = JSON.parse(post);
      let commentData = JSON.parse(comments);
      console.log(commentData);
      res.render('post', { post: postData, comments: commentData });
    }
  }).catch(err => {
    res.render('error', { error: err });
  });
});

/* POST comment form. */
router.post('/save-comment', function(req, res, next) {
  // let commentData = req.body;

  fetch('http://localhost:3001/save-comment', {
    method: 'post',
    body: JSON.stringify({
      postId: '65eb9ff50db9afa77fcd2bfd',
      username: 'freia',
      commentText: 'reeeeee'
    }),
    headers: {'Content-Type': 'application/json'},
  }).then(r => {
    r.json()
        .then(json => {
          console.log('Comment sent');
          res.redirect('/');
        })
        .catch(err => {
          console.log('Failed to send comment');
        });
  });
});

module.exports = router;
