const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/plant_entries';
let connection;

mongoose.Promise = global.Promise;

// Connect to the plant_entries database
mongoose.connect(mongoDB).then(result => {
    connection = result.connection;
    // console.log("MongoDB plant_entries database connection successful!");
}).catch(err => {
    console.log("MongoDB plant_entries database connection failed!", err);
});