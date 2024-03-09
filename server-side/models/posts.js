let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PostSchema  = new Schema(
    {
        image: {type: String},
        location: {type: String, max: 100},
        description: {type: String, max: 100},
        date: { type: Date, default: Date.now },
        height: {type: String, max: 100},
        spread: {type: String, max: 100},
        plant_name: {type: String, required: true, max: 100},
        username: {type: String, max: 100},
    }
);

PostSchema.set('toObject', {getters: true, virtuals: true});

let Post = mongoose.model('post', PostSchema);

module.exports = Post;