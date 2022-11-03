import mongoose from 'mongoose';

const settings = mongoose.model('settings', new mongoose.Schema({
    _id: { type: String, required: true },
    channel: { type: String },
    role: { type: String },
    lastSentComment: { type: Number },
}));

export default settings;
