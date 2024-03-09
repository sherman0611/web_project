var express = require('express');
var router = express.Router();
const posts = require("../controllers/posts");
var multer = require("multer");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST create post form. */
router.post('/create', function(req, res, next) {
  let postData = req.body;
  let filePath = req.file;
  let result = posts.create(postData, filePath);
  console.log('peppepeppe');
  return res.json({result: result});
});

module.exports = router;
