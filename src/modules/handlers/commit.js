import {
    getAllCommits, parseBuildNumber, getCommitComments, parseImages,
} from '../functions/commits.js';
import commits from '../../database/models/commits.js';

export default async function CommitHandler(bot) {
    // Fetch all commits
    const repoCommits = await getAllCommits();
    // Filter out commits that do not have comments
    const commitsWithCommands = repoCommits.filter((commit) => commit.commit.comment_count >= 1);

    // Loop through the commits
    for (const commit of commitsWithCommands.reverse()) {
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
            _id: comment.id,
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

        // Create an array of the first comment & expand any comment replies
        const [firstComment, ...subComments] = commentsMap;

        // Fetch the commit from the database
        const commitFromDB = await commits.findOne({ _id: firstComment.id });

        // If the commit is not in the database, add it
        if (!commitFromDB) {
            bot.logger.info(`Adding ${firstComment.buildNumber} to the database`);

            const doc = await commits.create({
                ...firstComment,
                comments: subComments,
            });

            // eslint-disable-next-line no-underscore-dangle
            bot.logger.info(`Added Commit ${doc._id} for Build ${doc.buildNumber}`);
        }
    }
}
