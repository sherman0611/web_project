let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantEntrySchema  = new Schema({
        username: {type: String, max: 20, required: true},
        plant_name: {type: String, max: 50, required: true},
        image: {type: String, required: false},
        image_url : {type: String, required: false},
        location: {type: String, max: 100, required: true},
        latitude:{type: String, max: 50, required: false},
        longitude:{type: String, max: 50, required: false},
        description: {type: String, max: 1000, required: false},
        height: {type: String, max: 50, required: false},
        spread: {type: String, max: 50, required: false},
        flowers: {type: String, required: false},
        colour: {type: String, max: 50, required: false},
        leaves: {type: String, required: false},
        fruits_seeds: {type: String, required: false},
        sun_exposure: {type: String, required: false},
        certainty: {type: String, required: true},
        identification_status: {type: String, default: "none"},
        date_seen: {type: Date, required: true},
        time_seen: {type: String, required: true},
        date_post: {type: Date, default: Date.now()},
        time_post: {type: String, default: () => new Date().toTimeString().split(' ')[0]}
    }
);

PlantEntrySchema.set('toObject', {getters: true, virtuals: true});

let PlantEntry = mongoose.model('plant_entry', PlantEntrySchema);

module.exports = PlantEntry;