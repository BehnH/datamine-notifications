import { Client } from 'discord.js';
import fetch, { Response } from 'node-fetch';
import { ICommits } from './database/interfaces/ICommits.js';
import commits from './database/models/commits.js';
import { Comment, Commit } from './types/GitHub.js';

const commitsURL = 'https://api.github.com/repos/Discord-datamining/discord-datamining/commits';

export const getAllCommits = async (): Promise<Array<Commit>> => {
    return new Promise((resolve, reject) => {
        fetch(`${commitsURL}?per_page=100`, {
            headers: {
                'User-Agent': 'Discord-datamining-bot',
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
        }).then((res: Response) => resolve(res.json() as unknown as Array<Commit>))
            .catch((err) => reject(err))
    })
};

export const getCommit = async (commit: Commit['sha']): Promise<Commit> => {
    return new Promise((resolve, reject) => {
        fetch(commitsURL + commit, {
            headers: {
                'User-Agent': 'Discord-datamining-bot',
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }
        }).then((res: Response) => resolve(res.json() as unknown as Commit))
        .catch((err) => reject(err))
    })
};

export const getLatestCommit = async (): Promise<ICommits> => {
    const latest = await commits.find({}).sort({ _id: -1 }).limit(1);
    return latest;
};

export const getCommitComments = async (commit: Commit['sha']): Promise<Array<Comment>> => {
    return new Promise((resolve, reject) => {
        fetch(`${commitsURL}/${commit}/comments`, {
            headers: {
                'User-Agent': 'Discord-datamining-bot',
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3.json'
            }
        }).then((res: Response) => resolve(res.json() as unknown as Array<Comment>))
        .catch((err) => reject(err))
    })
};

export const parseBuildNumber = (title: Commit['commit']['message']) => {
    const regex = /Build ([0-9]*)/;
    const match = title.match(regex);

    return match?.[1] ?? '';
};

export const parseImages = (body) => {
    const regex = /!\[[^\]]*\]\((?<filename>.*?)?\)/g;
    return [...body.matchAll(regex)].map((match) => match.groups.filename);
};

export const commitHandler = async (bot: Client) => {
    const commits = await getAllCommits();
    // Filter out any comments that don't have a comment (These are usually irrelvant/junk)
    const comments = commits.filter((commit) => commit.comment_count >= 1);

    for (const commit of comments.reverse()) {
        // Fetch the build number
        const buildNumber = parseBuildNumber(commit.commit.message);
        // Fetch the commit comments
        const comments = await getCommitComments(commit.sha);
        // Map all comments that have images
        // eslint-disable-next-line no-loop-func
        const commentsWithImages = comments.map((comment) => ({
            ...comment,
            images: parseImages(comment.body),
        }));

        // Transform the comments into a formed map
        const commentsMap = commentsWithImages.map((comment) => ({
            id: comment.id,
            title: commit.commit.message,
            buildNumber,
            timestamp: comment.created_at,
            description: comment.body,
            url: comment.html_url,
            user: {
                username: comment.user?.login,
                id: comment.user?.id,
                avatarURL: comment.user?.avatar_url,
                url: comment.user?.html_url,
            },
            images: comment.images,
        }));
    }
}
