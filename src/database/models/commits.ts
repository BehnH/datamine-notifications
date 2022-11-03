import mongoose from 'mongoose';
import { ICommits } from '../interfaces/ICommits';

const commits = mongoose.model('commits', new mongoose.Schema<ICommits>({
    _id: { type: String, required: true },
    buildNumber: { type: Number, required: true },
    title: { type: String, required: true },
    commit: {
        author: {
            date: { type: String, required: true }
        }
    },
    url: { type: String, required: true },
    images: [{ type: String, required: false }],
    commentCount: { type: Number, required: true },
    comments: [{ type: Object, required: false }],
}));

export default commits;
