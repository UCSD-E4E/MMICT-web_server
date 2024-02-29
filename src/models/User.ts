import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, required: true, unique: true },
  userId: { type: String, index: true, required: true, unique: true },
  images: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  classifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Classification' }]
}, { minimize: false });

export const User = mongoose.model('User', UserSchema);

