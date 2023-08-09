import mongoose from "mongoose";

const PolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    // Array of arrays of arrays of numbers
    type: [[[Number]]],
    required: true,
  },
});

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, index: true, required: true },
    reference: { type: String, required: true },
    labels: PolygonSchema,
  },
  { minimize: false },
);

export const Image = mongoose.model("Image", ImageSchema);
