let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PostSchema = new Schema(
    {
        image: {type: String},
        location: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        date: {type: Date},
        height: {type: String, required: true, max: 100},
        spread: {type: String, required: true, max: 100},
        plant_name: {type: String, required: true, max: 100},
        username: {type: String, required: true, max: 100},
    }
);

PostSchema.set('toObject', {getters: true, virtuals: true});

let Post = mongoose.model('post', PostSchema);

module.exports = Post;