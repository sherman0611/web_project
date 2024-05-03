const plantEntryModel = require('../models/plant_entries');

// Function to create new plant entries
exports.create = function (plantData) {
    let entry = new plantEntryModel({
        username: plantData.username,
        plant_name: plantData.plant_name,
        image: plantData.image,
        image_url: plantData.image_url,
        location: plantData.location,
        latitude: plantData.latitude,
        longitude: plantData.longitude,
        description: plantData.description,
        height: plantData.height,
        spread: plantData.spread,
        flowers: plantData.flowers,
        colour: plantData.colour, // Corrected the property name to match the model
        leaves: plantData.leaves,
        fruits_seeds: plantData.fruits_seeds,
        sun_exposure: plantData.sun_exposure,
        certainty: plantData.certainty,
        date: plantData.date,
        time: plantData.time,
    });

    return entry.save().then(plantEntry => {
        return JSON.stringify(plantEntry);
    }).catch(err => {
        console.log(err);
        return null;
    })
};

exports.getAll = function () {
    return plantEntryModel.find({}).then(entry => {
        return JSON.stringify(entry);
    }).catch(err => {
        console.log(err);
        return null;
    });
};

// Function to get plant entry by ID
exports.getById = function (plant_id) {
    return plantEntryModel.findById(plant_id).then(entry => {
        return JSON.stringify(entry);
    }).catch(err => {
        console.log(err);
        return null;
    });
};