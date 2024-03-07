const postModel = require('../models/posts');

exports.create = function (postData) {
    let currentDate = new Date();

    let post = new postModel({
        image_url: postData.image_url,
        location: postData.location,
        description: postData.description,
        date: currentDate,
        height: postData.height,
        spread: postData.spread,
        plant_name: postData.plant_name,
        username: postData.username,
    });

    return post.save().then(post => {
        console.log(post)
        return JSON.stringify(post);
    }).catch(err => {
        console.log(err);
        return null;
    })
}