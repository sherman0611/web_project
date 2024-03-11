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
    return res.json(posts);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

/* POST create post form. */
router.post('/create', upload.single('image_file'), function(req, res, next) {
  let postData = req.body.postData;
  let filePath = req.body.filePath;
  let result = posts.create(postData, filePath);
  console.log(result);
  return res.json({result: result});
});

/* POST comment form. */
router.post('/save-comment', function(req, res, next) {
  let commentData = req.body;
  let result = comments.create(commentData);
  return res.json({result: result});
});

module.exports = router;
