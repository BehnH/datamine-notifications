export type Commit = {
    sha: string,
    html_url: string,
    commit: {
        message: string,
        author: { date?: string },
    }
    comment_count: number
    comments?: Comment[]
}

export type Comment = {
    html_url: string,
    user: {
        login: string,
        avatar_url?: string,
        html_url: string,
    },
    created_at: string,
    updated_at?: string,
    body: string
}