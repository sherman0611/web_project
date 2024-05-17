let mongoose = require('mongoose');

let Schema = mongoose.Schema;

/**
 * Comment Schema
 * @type {Schema}
 * plant_id - the plant that the comment is about
 * username - the user who made the comment
 * comment_text - the comment itself
 * date - the date the comment was made
 */
let CommentSchema  = new Schema(
    {
        plant_id: {type: String, max: 100},
        username: {type: String, max: 100},
        comment_text: {type: String},
        date: { type: Date, default: Date.now() }
    }
);

CommentSchema.set('toObject', {getters: true, virtuals: true});

let Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;