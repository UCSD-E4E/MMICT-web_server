import mongoose from "mongoose";

const ClassificationSchema = new mongoose.Schema({
  name: { type: String, index: true, required: true },
  userid: { type: String, index: true, required: true },
  reference: { type: String, required: true },
  data: { type: JSON, required: true },
}, { minimize: false });

export const Classification = mongoose.model('Classification', ClassificationSchema);