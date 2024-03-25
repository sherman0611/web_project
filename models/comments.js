let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CommentSchema  = new Schema(
    {
        plant_id: {type: String, max: 100},
        username: {type: String, max: 100},
        commentText: {type: String},
        date: { type: Date, default: Date.now }
    }
);

CommentSchema.set('toObject', {getters: true, virtuals: true});

let Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;