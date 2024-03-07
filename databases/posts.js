const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/posts';
let connection;

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB).then(result => {
    connection = result.connection;
    console.log("MongoDB posts database connection successful!");
}).catch(err => {
    console.log("MongoDB posts database connection failed!", err);
});