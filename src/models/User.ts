import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, index: true, required: true, unique: true },
    password: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  },
  { minimize: false },
);

export const User = mongoose.model("User", UserSchema);
