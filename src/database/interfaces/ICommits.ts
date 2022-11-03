import { Comment } from "../../types/GitHub"

export interface ICommits {
    _id: string,
    url: string,
    commit: {
        message: string,
        author: {
            date: string
        }
    },
    buildNumber: number,
    title: string,
    commentCount: number,
    comments: Array<Comment>
    images: Array<string>
}