var express = require('express');
var router = express.Router();
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
  fetch('http://localhost:3001/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response;
      }).then(response => {
        console.log(response.headers.get('Content-Type'));
        if (response.headers.get('Content-Type').includes('application/json')) {
          return response.json();
        } else {
          res.render('error', {
            message: 'Invalid Content Type',
            error: {status: 500, stack: 'Invalid Content type!'}
          });
        }
      }).then(data => {
        let postData = JSON.parse(data);
        res.render('index', { title: 'PlantHub', data: postData});
      }).catch(error => {
        res.render('index', { title: 'PlantHub', data: null });
      });
});


/* GET create post page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create post' });
});

/* POST create post form. */
router.post('/create', function(req, res, next) {
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

  fetch('http://localhost:3001/post/' + postId)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response;
      }).then(response => {
        console.log(response.headers.get('Content-Type'));
        if (response.headers.get('Content-Type').includes('application/json')) {
          return response.json();
        } else {
          res.render('error', {
            message: 'Invalid Content Type',
            error: {status: 500, stack: 'Invalid Content type!'}
          });
        }
      }).then(data => {
        let postData = JSON.parse(data.post);
        let commentsData = JSON.parse(data.comments);
        res.render('post', { postId: postId, post: postData, comments: commentsData });
      }).catch(error => {
        res.render('post', { postId: postId, post: null, comments: null });
      });
});

/* POST comment form. */
router.post('/save-comment', function(req, res, next) {
  // let commentData = req.body;
  console.log(req);

  fetch('http://localhost:3001/save-comment', {
    method: 'post',
    body: JSON.stringify({
      postId: req.body.postId,
      username: req.body.username,
      commentText: req.body.commentText
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
