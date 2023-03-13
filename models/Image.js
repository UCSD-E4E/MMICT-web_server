const mongoose = require('mongoose');

const PolygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        required: true
    }
});

const ImageSchema = new mongoose.Schema({
  name: { type: String, index: true, required: true },
  reference: { type: String, required: true },
  labels: PolygonSchema,
}, { minimize: false });

module.exports = mongoose.model('Image', ImageSchema);

