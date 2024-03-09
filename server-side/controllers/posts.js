const postModel = require('../models/posts');

// Function to create new posts
exports.create = function (postData, filePath) {
    let post = new postModel({
        image: filePath,
        location: postData.location,
        description: postData.description,
        height: postData.height,
        spread: postData.spread,
        plant_name: postData.plant_name,
        username: postData.username,
    });

    return post.save().then(post => {
        console.log(post);
        return JSON.stringify(post);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

// Function to get all posts
exports.getAll = function () {
    return postModel.find({}).then(posts => {
        return JSON.stringify(posts);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

// Function to get post by ID
exports.getById = function (postId) {
    return postModel.findById(postId).then(post => {
        return post;
    }).catch(err => {
        console.log(err);
        return null;
    });
};