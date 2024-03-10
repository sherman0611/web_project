const commentModel = require('../models/comments');

// Function to create new posts
exports.create = function (userId, postId, commentText) {
    let comment = new commentModel({
        postId: postId,
        userId: userId,
        commentText: commentText
    });

    return comment.save().then(comment => {
        console.log(comment);
        return JSON.stringify(comment);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

exports.getAllByPostId = function (postId) {
    return commentModel.find({ postId: postId }).then(comments => {
        return JSON.stringify(comments);
    }).catch(err => {
        console.log(err);
        return null;
    });
};
