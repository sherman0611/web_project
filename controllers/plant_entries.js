const plantEntryModel = require('../models/plant_entries');

// Function to create new plant entries
// Input:  plantData
//         filePath - for saving the image
// Return: JSON object on success
//         null on failure
exports.create = function (plantData, filePath) {
    let entry = new plantEntryModel({
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
        colour: plantData.colour,
        leaves: plantData.leaves,
        fruits_seeds: plantData.fruits_seeds,
        sun_exposure: plantData.sun_exposure,
        status: plantData.status,
        date_seen: plantData.date_seen,
        time_seen: plantData.time_seen,
        date_post :plantData.date_post,
        time_post : plantData.time_post
    });

    return entry.save().then(entry => {
        return JSON.stringify(entry);
    }).catch(err => {
        console.log(err);
        return null;
    })
}

// Function to get all plant entries
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

// Function to get plant entries by username
exports.update = async (plantId, plantData) => {
    try {
        // Update only the name and identification fields
        const updateData = {
            plant_name: plantData.plant_name,
            status: plantData.status
        };

        // findByIdAndUpdate used to update the plant
        const updatedPlant = await plantEntryModel.findByIdAndUpdate(plantId, updateData,{
            new: true,  // return the updated document
            runValidators: true  // validate before update
        });

        if (!updatedPlant) {
            alert('Plant not found');
        }

        return { success: true, data: updatedPlant };
    } catch (error) {
        console.error('Error updating plant:', error);
        alert('Failed to update plant');
    }
};