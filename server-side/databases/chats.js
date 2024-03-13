// const mongoose = require('mongoose');
//
// const mongoDB = 'mongodb://localhost:27017/comments';
// let connection;
//
// mongoose.Promise = global.Promise;
//
// mongoose.connect(mongoDB).then(result => {
//     connection = result.connection;
//     console.log("MongoDB chat database connection successful!");
// }).catch(err => {
//     console.log("MongoDB chat database connection failed!", err);
// });