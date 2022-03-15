import mongoose from 'mongoose';

const commits = mongoose.model('commits', new mongoose.Schema({
    _id: { type: Number, required: true },
    buildNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    images: { type: Array, required: false },
    user: {
        username: { type: String, required: true },
        id: { type: String, required: true },
        avatarURL: { type: String, required: true },
        url: { type: String, required: true },
    },
    comments: { type: Array, required: false },
    timestamp: { type: String, required: true },
}));

export default commits;
