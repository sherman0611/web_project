let mongoose = require('mongoose');

let Schema = mongoose.Schema;

/**
 * Plant Entry Schema
 * @type {Schema}
 * username - the user who made the entry
 * plant_name - the name of the plant
 * image - the image of the plant
 * image_url - the URL of the image
 * location - the location of the plant
 * latitude - the latitude of the plant
 * longitude - the longitude of the plant
 * description - the description of the plant
 * height - the height of the plant
 * spread - the spread of the plant
 * flowers - whether the plant has flowers
 * colour - whether the plant has a colour
 * leaves - whether the plant has leaves
 * fruits_seeds - whether the plant has fruits or seeds
 * sun_exposure - whether the plant has sun exposure
 * status - the identification status of the plant
 * date_seen - the date the plant was seen
 * time_seen - the time the plant was seen
 * date_post - the date the plant was posted
 * time_post - the time the plant was posted   
 */
let PlantEntrySchema  = new Schema({
        username: {type: String, max: 20, required: true},
        plant_name: {type: String, max: 50, required: true},
        image: {type: String, required: false},
        image_url : {type: String, required: false},
        location: {type: String, max: 100, required: true},
        latitude:{type: String, max: 50, required: false},
        longitude:{type: String, max: 50, required: false},
        description: {type: String, max: 1000, required: true},
        height: {type: String, max: 50, required: true},
        spread: {type: String, max: 50, required: true},
        flowers: {type: String, required: true},
        colour: {type: String, max: 50, required: false},
        leaves: {type: String, required: true},
        fruits_seeds: {type: String, required: true},
        sun_exposure: {type: String, required: true},
        status: {type: String, required: true},
        date_seen: {type: Date, required: true},
        time_seen: {type: String, required: true},
        date_post: {type: Date, default: Date.now()},
        time_post: {type: String, default: () => new Date().toTimeString().split(' ')[0]}
    }
);

PlantEntrySchema.set('toObject', {getters: true, virtuals: true});

let PlantEntry = mongoose.model('plant_entry', PlantEntrySchema);

module.exports = PlantEntry;