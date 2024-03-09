var express = require('express');
var router = express.Router();
const posts = require("../controllers/posts");
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
    // console.log(data.length);
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
  let result = posts.create(postData, filePath);
  console.log(result);
  res.redirect('/');
});

router.post('/create', function(req, res, next) {
  let firstNo = req.body.firstNumber;
  let secondNo = req.body.secondNumber;

  fetch('http://localhost:3000/add', {
    method: 'post',
    body: JSON.stringify({
      firstNumber: firstNo,
      secondNumber: secondNo
    }),
    headers: {'Content-Type': 'application/json'},
  }).then(r => {
    r.json()
        .then(json => {
          res.render('index', {title: " The result is : " + json.result})
        })
        .catch(err =>
            res.render('index', {title: err}));
  });
});

/* GET post details page. */
router.get('/post/:id', function(req, res, next) {
  const postId = req.params.id;
  let result = posts.getById(postId);
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
