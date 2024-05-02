const plantEntryModel = require('../models/plant_entries');

// Function to create new plant entries
exports.create = function (plantData, filePath) {
    let plant_entry = new plantEntryModel({
        username: plantData.username,
        plant_name: plantData.plant_name,
        image: filePath,
        image_url: plantData.image_url,
        location: plantData.location,
        latitude: plantData.latitude,
        longitude: plantData.longitude,
        description: plantData.description,
        height: plantData.height,
        spread: plantData.spread,
        flowers: plantData.flowers,
        colour_flowers: plantData.colour_flowers,
        leaves: plantData.leaves,
        fruits_seeds: plantData.fruits_seeds,
        sun_exposure: plantData.sun_exposure,
        identification_status: plantData.identification_status,
        date_post: plantData.date_post,
        date_seen: plantData.date_seen,
        time_post: plantData.time_post,
        time_seen: plantData.time_seen
    });

    return plant_entry.save().then(plantEntry => {
        return JSON.stringify(plantEntry);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

exports.getAll = function () {
    return plantEntryModel.find({}).then(plantEntry => {
        return JSON.stringify(plantEntry);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

// Function to get plant entry by ID
exports.getById = function (plant_id) {
    return plantEntryModel.findById(plant_id).then(plant => {
        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);
        return null;
    });
};