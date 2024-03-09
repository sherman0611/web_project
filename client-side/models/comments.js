let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CommentSchema  = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'post'
        },
        userId: {type: String},
        commentText: {type: String},
        time: { type: Date, default: Date.now }
    }
);

CommentSchema.set('toObject', {getters: true, virtuals: true});

let Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;