const plantEntryModel = require('../models/plant_entries');

// Function to create new plant entries
// Input:  plantData
//         filePath - for saving the image
// Return: JSON object on success
//         null on failure
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

// Function to update plant entry by ID
exports.update = async (plantId, plantData) => {
    try {
        // Update only the name and identification fields
        const updateData = {
            plant_name: plantData.plant_name,
            identification_status: plantData.identification_status
        };

        // findByIdAndUpdate used to update the plant
        const updatedPlant = await plantEntryModel.findByIdAndUpdate(plantId, updateData,{
            new: true,  // return the updated document
            runValidators: true  // validate before update
        });

        if (!updatedPlant) {
            throw new Error('Plant not found');
        }

        return { success: true, data: updatedPlant };
    } catch (error) {
        console.error('Error updating plant:', error);
        throw new Error('Failed to update plant: ' + error.message);
    }
};