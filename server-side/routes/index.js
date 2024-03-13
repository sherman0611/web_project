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
  result.then(plants => {
    return res.json(plants);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

/* GET plant entry details page. */
router.get('/plant_entry/:id', function(req, res, next) {
  const plant_id = req.params.id;

  let plantResult = plant_entries.getById(plant_id);
  let commentsResult = comments.getAllByPlantId(plant_id);

  Promise.all([plantResult, commentsResult])
      .then(results => {
        const [plant_entry, comments] = results;
        return res.json({ plant_entry: plant_entry, comments }); // Sending both plant_entry and comments as JSON response
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
});

/* POST create post form. */
router.post('/create', upload.single('image_file'), function(req, res, next) {
  let plantData = req.body.plantData;
  let filePath = req.body.filePath;
  let result = plant_entries.create(plantData, filePath);
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
