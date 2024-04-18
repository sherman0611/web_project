var express = require('express');
var router = express.Router();
const plant_entries = require("../controllers/plant_entries");
const comments = require("../controllers/comments");
var multer = require("multer");

var storage = multer.diskStorage({
    destination :function(req, file, cb){
        cb(null, '../public/images/uploads/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        filename = Date.now() + '.' + file_extension[file_extension.length - 1];
        cb(null, filename);
    }
});
let upload = multer({ storage: storage });

/* GET home page without sorting. Keep for now just in case the sorting fails somehow. */
// router.get('/home', function(req, res, next) {
//     let result = plant_entries.getAll();
//     result.then(plant_entries => {
//         let data = JSON.parse(plant_entries);
//         res.render('index', { title: 'Plantgram', data: data});
//     }).catch(err => {
//         res.render('index', { title: 'Plantgram', data: null });
//     });
// });

/* GET home page with sorting. */
router.get('/home', function(req, res, next) {
    let result = plant_entries.getAll();
    result.then(plant_entries => {
        let data = JSON.parse(plant_entries);
        res.render('index', { title: 'Plantgram', data: data });
    }).catch(err => {
        console.log("Error retrieving plant entries: ", err);
        res.render('index', { title: 'Plantgram', data: null });
    });
});


/* GET index page. */
router.get('/enter_username', function(req, res, next) {
    res.render('enter_username', { title: 'Enter your username' });
});

router.get('/', function(req, res, next) {
    let result = plant_entries.getAll();
    result.then(plant_entries => {
        let data = JSON.parse(plant_entries);
        res.render('index', { title: 'Plantgram', data: data });
    }).catch(err => {
        console.log("Error retrieving plant entries: ", err);
        res.render('index', { title: 'Plantgram', data: null });
    });
});

router.post('/enter_username', function(req, res, next) {
    res.redirect('/home');
});


/* GET create plant entry page. */
router.get('/create_plant', function(req, res, next) {
  res.render('create_plant', { title: 'Create plant entry' });
});

/* POST create plant entry form. */
router.post('/create_plant', upload.single('image_file'), function(req, res, next) {
  let plantData = req.body;
  let filePath = null;
  if (req.file && req.file.path) {
        filePath = req.file.path;
        console.log(req.file);
    }
  console.log(req.file);
  let result = plant_entries.create(plantData, filePath);
  result.then(plant_entry => {
    res.redirect('/home');
  }).catch(err => {
    console.log("cannot create post");
  });
});

/* GET plant entry page. */
router.get('/view_plant/:id', function(req, res, next) {
    const plant_id = req.params.id;

    let plantResult = plant_entries.getById(plant_id);
    let commentsResult = comments.getAllByPlantId(plant_id);

    Promise.all([plantResult, commentsResult])
        .then(results => {
            let plantData = JSON.parse(results[0]);
            let commentsData = JSON.parse(results[1]);
            res.render('view_plant', { title: 'View plant entry', plant_id: plant_id, plant_entry: plantData, comments: commentsData });
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
            res.render('view_plant', { title: 'View plant entry', plant_id: plant_id, plant_entry: plantData, comments: commentsData });
        });
});

/* POST comment form. */
router.post('/create_comment', function(req, res, next) {
    let commentData = req.body;
    let result = comments.create(commentData);
    result.then(comment => {
        let data = JSON.parse(comment);
        res.send(data);
    }).catch(err => {
        console.log("cannot create comment");
        res.status(500).send("Cannot create comment");
    });
});

module.exports = router;
