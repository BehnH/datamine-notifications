import fetch from 'node-fetch';
import commits from '../../database/models/commits.js';

const commitsURL = 'https://api.github.com/repos/Discord-datamining/discord-datamining/commits';

export const getAllCommits = async () => {
    const response = await fetch(commitsURL, {
        headers: {
            'User-Agent': 'Discord-datamining-v2022.2',
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
    });

    return response.json();
};

export const getCommit = async (commit) => {
    const response = await fetch(`${commitsURL}/${commit}`, {
        headers: {
            'User-Agent': 'Discord-datamining-v2022.2',
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
    });

    return response.json();
};

export const getLatestCommit = async () => {
    const latest = await commits.find({}).sort({ _id: -1 }).limit(1);
    return latest;
};

export const getCommitComments = async (commit) => {
    const response = await fetch(`${commitsURL}/${commit}/comments`, {
        headers: {
            'User-Agent': 'Discord-datamining-v2022.2',
            Accept: 'application/vnd.github.v3.json',
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
    });

    return response.json();
};

export const parseBuildNumber = (title) => {
    const regex = /Build ([0-9]*)/;
    const match = title.match(regex);

    return match?.[1] ?? '';
};

export const parseImages = (body) => {
    const regex = /!\[[^\]]*\]\((?<filename>.*?)?\)/g;
    return [...body.matchAll(regex)].map((match) => match.groups.filename);
};
