const commentModel = require('../models/comments');

// Function to create new plant entries
exports.create = function (commentData) {
    let comment = new commentModel({
        plant_id: commentData.plant_id,
        username: commentData.username,
        commentText: commentData.commentText,
    });

    return comment.save().then(comment => {
        return JSON.stringify(comment);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

exports.getAllByPlantId = function (plant_id) {
    return commentModel.find({ plant_id: plant_id }).then(comments => {
        return JSON.stringify(comments);
    }).catch(err => {
        console.log(err);
        return null;
    });
};