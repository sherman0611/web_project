const plantEntryModel = require('../models/plant_entries');

// Function to create new plant entries
exports.create = function (plantData, filePath) {
    let plant_entry = new plantEntryModel({
        image: filePath,
        location: plantData.location,
        description: plantData.description,
        height: plantData.height,
        spread: plantData.spread,
        plant_name: plantData.plant_name,
        username: plantData.username,
    });

    return plant_entry.save().then(plantEntry => {
        return JSON.stringify(plantEntry);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

// Function to get all plant entries
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