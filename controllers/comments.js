const commentModel = require('../models/comments');

// Create a new comment
// Input:  commentData
// Return: JSON object on success
//         null on failure
exports.create = function (commentData) {
    console.log(commentData)
    let comment = new commentModel({
        plant_id: commentData.plant_id,
        username: commentData.username,
        comment_text: commentData.comment_text,
    });

    return comment.save().then(comment => {
        return JSON.stringify(comment);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

// Get all comments from a given plant
// Input:  plant_id
// Return: JSON object of all comments on success
//         null on failure
exports.getAllByPlantId = function (plant_id) {
    return commentModel.find({ plant_id: plant_id }).then(comments => {
        return JSON.stringify(comments);
    }).catch(err => {
        console.log(err);
        return null;
    });
};