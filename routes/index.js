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
})

router.get('/create_plant', function(req, res, next) {
    res.render('create_plant', { title: 'Create plant entry' });
});

router.get('/enter_username', function(req, res, next) {
    res.render('enter_username', { title: 'Enter your username' });
});

router.get('/pending_posts', function(req, res, next) {
    res.render('pending_posts', { title: 'Pending posts' });
});

router.get('/error', function(req, res, next) {
    res.render('error', { title: 'Error' });
});

router.get('/entries', function (req, res, next) {
    entries.getAll().then(entries => {
        return res.send(entries);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.get('/comments/:id', function (req, res, next) {
    let plant_id = req.params.id;
    comments.getAllByPlantId(plant_id).then(comments => {
        return res.send(comments);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.post('/create_entry', upload.single('image'), function(req, res, next) {
    let filePath = null;
    if (req.file && req.file.path) {
        filePath = req.file.path;
    }
    let result = entries.create(req.body, filePath)
    result.then(plant_entry => {
        res.send("Entry created!");
    }).catch(err => {
        console.log("cannot create entry" + err);
        res.status(500).send("Cannot create entry");
    });
});

/* POST edit plant form */
router.post('/edit_plant/:id/update', async function (req, res, next) {
    //get plant id
    let plant_id = req.params.id;
    //get the new data from the form
    let plantDataForm = req.body;
    //update the plant entry with the new data
    let result = entries.update(plant_id, plantDataForm);
    //redirect to the view plant entry page
    result.then(plant_entry => {
        res.redirect('/view_plant/'+plant_id);
    }).catch(err => {
        console.log("cannot update post");
    });
});

/* GET plant entry page. */
router.get('/view_plant/:id', function(req, res, next) {
    const plant_id = req.params.id;

    let plantResult = entries.getById(plant_id);

    Promise.all([plantResult])
        .then(results => {
            let plantData = JSON.parse(results[0]);
            res.render('view_plant', { title: 'View plant entry', plant_id: plant_id, plant_entry: plantData });
        }).catch(errors => {
            res.render('view_plant', { title: 'View plant entry', plant_id: plant_id, plant_entry: null });
        });
});

router.get('/edit_plant/:id', function(req, res, next) {
    const plant_id = req.params.id;
    let plantResult = entries.getById(plant_id);

    Promise.all([plantResult])
        .then(results => {
            let plantData = JSON.parse(results[0]);
            res.render('edit_plant', { title: 'Edit plant entry', plant_id: plant_id, plant_entry: plantData });
        }).catch(errors => {
            let plantData = null;
            if (!errors[0]) {
                plantData = JSON.parse(errors[0]);
            }
            res.render('edit_plant', { title: 'Edit plant entry', plant_id: plant_id, plant_entry: plantData });
    });
});

/* POST comment form. */
router.post('/send_comment', upload.none(), function(req, res, next) {
    let result = comments.create(req.body);
    result.then(comment => {
        let data = JSON.parse(comment);
        res.send(data);
    }).catch(err => {
        console.log("cannot create comment");
        res.status(500).send("Cannot create comment");
    });
});

/**
 * GET main page after searching, sorting or/and filtering data
 * @param req
 * @param res
 */
router.get('/fetch-data', (req, res) => {
    try {
        let result = entries.getAll();
        result.then(plant_entries => {
            let data = JSON.parse(plant_entries);
            const { order, status, query } = req.query;

            let filteredData = filterDataByStatus(data, status);
            let searchedData = searchData(filteredData, query);
            let sortedSearchedData = sortData(searchedData, order);

            res.json(sortedSearchedData);
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
        let datetimeA, datetimeB;
        switch (order) {
            case 'time_seen_asc':
                datetimeA = new Date(`${a.date_seen.split('T')[0]}T${a.time_seen}`);
                datetimeB = new Date(`${b.date_seen.split('T')[0]}T${b.time_seen}`);
                return datetimeA - datetimeB;
            case 'time_seen_desc':
                datetimeA = new Date(`${a.date_seen.split('T')[0]}T${a.time_seen}`);
                datetimeB = new Date(`${b.date_seen.split('T')[0]}T${b.time_seen}`);
                return datetimeB - datetimeA;
            case 'time_post_asc':
                datetimeA = new Date(`${a.date_post.split('T')[0]}T${a.time_post}`);
                datetimeB = new Date(`${b.date_post.split('T')[0]}T${b.time_post}`);
                return datetimeA - datetimeB;
            case 'time_post_desc':
                datetimeA = new Date(`${a.date_post.split('T')[0]}T${a.time_post}`);
                datetimeB = new Date(`${b.date_post.split('T')[0]}T${b.time_post}`);
                return datetimeB - datetimeA;
            default:
                return 0; // No sorting applied
        }
    });
}


/**
 * Search data by username, plant name, location, description, colour, and sun exposure
 * @param data
 * @param query
 * @returns {Array} - filtered data by keyword
 */ 
function searchData(data, query) {
    if (!query) return data;

    return data.filter(item => {
        const lowerQuery = query.toLowerCase();
        return (item.username && item.username.toLowerCase().includes(lowerQuery)) ||
            (item.plant_name && item.plant_name.toLowerCase().includes(lowerQuery)) ||
            (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
            (item.colour && item.colour.toLowerCase().includes(lowerQuery)) ||
            (item.sun_exposure && item.sun_exposure.toLowerCase().includes(lowerQuery));
    });
}

/**
 * Filter data by identification status
 * @param data
 * @param status - identification status (unknown, completed, in_progress)
 * @returns {Array} - filtered data
 */
function filterDataByStatus(data, status) {
    if (status === "all") {
        return data;
    }
    return data.filter(item => item.status === status);
}

module.exports = router;
