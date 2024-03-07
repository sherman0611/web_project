var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PlantHub' });
});

/* GET create post page. */
router.get('/create-post', function(req, res, next) {
  res.render('create-post');
});

module.exports = router;
