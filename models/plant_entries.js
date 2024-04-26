let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantEntrySchema  = new Schema({
        username: {type: String, max: 20, required: true},
        plant_name: {type: String, max: 50, required: true},
        image: {type: String, required: false},
        image_url : {type: String, required: false},
        location: {type: String, max: 100, required: false},
        latitude:{type: String, max: 50, required: false},
        longitude:{type: String, max: 50, required: false},
        description: {type: String, max: 200, required: true},
        height: {type: String, max: 4, required: true},
        spread: {type: String, max: 4, required: true},
        flowers: {type: Boolean, required: true},
        colour: {type: String, max: 10, required: false},
        leaves: {type: Boolean, required: true},
        fruits_seeds: {type: Boolean, required: true},
        sun_exposure: {type: String, max: 100, required: true},
        identification_status: {type: String, required: true},
        // dbpedia_URI: {type: String, max: 100, required: false},
        dateSeen: { type: Date, required: false},
        datePost: { type: Date, default:Date.now()},
        timeSeen: { type: String, required: false},
        timePost: { type: String, default: () => new Date().toTimeString().split(' ')[0] }
    }
);

PlantEntrySchema.set('toObject', {getters: true, virtuals: true});

let PlantEntry = mongoose.model('plant_entry', PlantEntrySchema);

module.exports = PlantEntry;