import mongoose from "mongoose";

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
  userid: { type: String, index: true, required: true },
  reference: { type: String, required: true },
  labels: PolygonSchema,
}, { minimize: false });

export const Image = mongoose.model('Image', ImageSchema);

