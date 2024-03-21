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
        let plantData = JSON.parse(data);
        res.render('enter_username', { title: 'Plantgram', data: plantData});
      }).catch(error => {
        res.render('enter_username', { title: 'Plantgram', data: null });
      });
});


/* GET create plant entry page. */
router.get('/create_entry', function(req, res, next) {
  res.render('create_entry', { title: 'Create plant entry' });
});

/* POST create plant entry form. */
router.post('/create_entry', function(req, res, next) {
  let plantData = req.body;
  let filePath = req.file ? req.file.path : null;

  fetch('http://localhost:3001/create_entry', {
    method: 'post',
    body: JSON.stringify({
      plantData: plantData,
      filePath: filePath
    }),
    headers: {'Content-Type': 'application/json'},
  }).then(r => {
    r.json()
        .then(json => {
          res.redirect('/');
        })
        .catch(err => {
          console.log('Failed to create plant entry');
        });
  });
});

/* GET plant entry details page. */
router.get('/plant_entry2/:id', function(req, res, next) { // TODO CHANGE
  const plant_id = req.params.id;

  fetch('http://localhost:3001/plant_entry2/' + plant_id) // TODO CHANGE
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
        // let plantData = JSON.parse(data.plant_entry); TODO UNCOMMENT
        // let commentsData = JSON.parse(data.comments); TODO UNCOMMENT
        res.render('plant_entry2', { title: 'View plant entry', plant_id: plant_id, plant_entry: plantData, comments: commentsData }); // TODO CHANGE
      }).catch(error => {
        res.render('plant_entry2', { title: 'View plant entry', plant_id: plant_id, plant_entry: null, comments: null }); // TODO CHANGE
      });
});

/* POST comment form. */
router.post('/save-comment', function(req, res, next) {
  // let commentData = req.body;
  console.log(req);

  fetch('http://localhost:3001/save-comment', {
    method: 'post',
    body: JSON.stringify({
      plant_id: req.body.plant_id,
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
