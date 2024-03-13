const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/plant_entries.js';
let connection;

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB).then(result => {
    connection = result.connection;
    console.log("MongoDB plant_entries.js database connection successful!");
}).catch(err => {
    console.log("MongoDB plant_entries.js database connection failed!", err);
});