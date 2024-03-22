var express = require('express');
var router = express.Router();
const plant_entries = require("../controllers/plant_entries");
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
    let result = plant_entries.getAll();
    result.then(plant_entries => {
        let data = JSON.parse(plant_entries);
        res.render('index', { title: 'Plantgram', data: data});
    }).catch(err => {
        res.render('index', { title: 'Plantgram', data: null });
    });
});

/* GET create plant entry page. */
router.get('/create_entry', function(req, res, next) {
  res.render('create_entry', { title: 'Create plant entry' });
});

/* POST create plant entry form. */
router.post('/create_entry', upload.single('image_file'), function(req, res, next) {
  let plantData = req.body;
  let filePath = req.file ? req.file.path : null;
  let result = plant_entries.create(plantData, filePath);
  console.log(result);
  result.then(plant_entry => {
    res.redirect('/');
  }).catch(err => {
    console.log("cannot create post");
  });
});

/* GET plant entry page. */
router.get('/plant_entry/:id', function(req, res, next) {
    const plant_id = req.params.id;

    let plantResult = plant_entries.getById(plant_id);
    let commentsResult = comments.getAllByPlantId(plant_id);

    Promise.all([plantResult, commentsResult])
        .then(results => {
            let plantData = JSON.parse(results[0]);
            let commentsData = JSON.parse(results[1]);
            res.render('plant_entry', { plant_id: plant_id, plant_entry: plantData, comments: commentsData });
        })
        .catch(errors => {
            let plantData = null;
            let commentsData = null;
            if (!errors[0]) {
                plantData = JSON.parse(errors[0]);
            }
            if (!errors[1]) {
                commentsData = JSON.parse(errors[1]);
            }
            res.render('plant_entry', { plant_id: plant_id, plant_entry: plantData, comments: commentsData });
        });
});

/* POST comment form. */
router.post('/create_comment', function(req, res, next) {
  let commentData = req.body;
  let result = comments.create(commentData);
  console.log(result);
  result.then(comment => {
      res.redirect('/');
  }).catch(err => {
      console.log("cannot create comment");
  });
});

module.exports = router;
