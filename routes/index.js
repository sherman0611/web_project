var express = require('express');
var router = express.Router();
const entries = require("../controllers/plant_entries");
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

/* GET index page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home page' });
});

router.get('/enter_username', function(req, res, next) {
    res.render('enter_username', { title: 'Enter your username' });
});

// route to get all todos
router.get('/entries', function (req, res, next) {
    entries.getAll().then(entries => {
        return res.status(200).send(entries);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

/* GET create plant entry page. */
router.get('/create_plant', function(req, res, next) {
    res.render('create_plant', { title: 'Create plant entry' });
});

/* POST create plant entry form. */
router.post('/create_entry', function(req, res, next) {
    entries.create(req.body)
        .then(plant_entry => {
            res.status(200).send("Entry created!");
        })
        .catch(err => {
            console.log("cannot create post" + err);
            res.status(500).send("Cannot create post");
        });
});

/* GET plant entry page. */
router.get('/view_plant/:id', function(req, res, next) {
    const plant_id = req.params.id;

    let plantResult = entries.getById(plant_id);
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
router.post('/send_comment', function(req, res, next) {
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

router.get('/sort-data', (req, res) => {
    try {
        let result = entries.getAll();
        result.then(plant_entries => {
            let data = JSON.parse(plant_entries);
            const { order } = req.query;
            if (!order) {
                return res.status(400).json({ error: "Order parameter is required" });
            }
            const sortedData = sortData(data, order); // Ensure sortData is correctly implemented
            res.json(sortedData);
        }).catch(err => {
            console.log('Error:', err);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function sortData(data, order) {
    return data.sort((a, b) => {
        return (order === 'date-asc') ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });
}

router.get('/fetch-data', (req, res) => {
    try {
        let result = entries.getAll();
        result.then(plant_entries => {
            let data = JSON.parse(plant_entries);
            const { order, status } = req.query;
            // const statusBool = status === 'true';  // Ensure the status is interpreted as a boolean
            if (!order) {
                return res.status(400).json({ error: "Order parameter is required" });
            }
            let filteredData = filterDataByStatus(data, status);
            let sortedFilteredData = sortData(filteredData, order);
            res.json(sortedFilteredData);
        }).catch(err => {
            console.log('Error:', err);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function filterDataByStatus(data, status) {
    if (status === "all") {
        return data;
    }
    return data.filter(item => item.identification_status === status);
}

router.get('/edit_plant/:id', function(req, res, next) {
    const plant_id = req.params.id;

    let plantResult = entries.getById(plant_id);
    Promise.all([plantResult])
        .then(results => {
            let plantData = JSON.parse(results[0]);
            console.log(plantResult)
            res.render('edit_plant', { title: 'Edit plant entry', plant_id: plant_id, plant_entry: plantData });
        })
        .catch(errors => {
            let plantData = null;
            if (!errors[0]) {
                plantData = JSON.parse(errors[0]);
            }
            res.render('edit_plant', { title: 'Edit plant entry', plant_id: plant_id, plant_entry: plantData });
        });
});

module.exports = router;
