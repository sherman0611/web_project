let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantEntrySchema  = new Schema({
        id: {type: Number},
        username: {type: String, max: 100, required: true},
        plant_name: {type: String, max: 100, required: true},
        image: {type: String},
        location: {type: String, max: 100, required: true},
        description: {type: String, max: 100, required: true},
        height: {type: String, max: 100},
        spread: {type: String, max: 100},
        flowers: {type: Boolean, required: true},
        colour_flowers: {type: String, max: 100, required: true},
        leaves: {type: Boolean, required: true},
        fruits_seeds: {type: Boolean, required: true},
        sun_exposure: {type: String, max: 100, required: true},
        identification_status: {type: Boolean, required: true},
        dbpedia_URI: {type: String, max: 100, required: true},
        date: { type: Date, default: Date.now },
    }
);

PlantEntrySchema.set('toObject', {getters: true, virtuals: true});

let PlantEntry = mongoose.model('plant_entry', PlantEntrySchema);

module.exports = PlantEntry;