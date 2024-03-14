let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantEntrySchema  = new Schema({
        username: {type: String, max: 20, required: true},
        plant_name: {type: String, max: 50, required: true},
        image: {type: String, required: true},
        location: {type: String, max: 100, required: true},
        description: {type: String, max: 200, required: true},
        height: {type: String, max: 4, required: false},
        spread: {type: String, max: 4, required: false},
        flowers: {type: Boolean, required: false},
        colour_flowers: {type: String, max: 50, required: false},
        leaves: {type: Boolean, required: false},
        fruits_seeds: {type: Boolean, required: false},
        sun_exposure: {type: String, max: 100, required: false},
        identification_status: {type: Boolean, required: true},
        dbpedia_URI: {type: String, max: 100, required: false},
        date: { type: Date, default: Date.now, required: true }
    }
);

PlantEntrySchema.set('toObject', {getters: true, virtuals: true});

let PlantEntry = mongoose.model('plant_entry', PlantEntrySchema);

module.exports = PlantEntry;