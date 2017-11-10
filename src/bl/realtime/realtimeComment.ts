import { RealTimeEvent } from '../realtimeFacade'

import { Comment } from '../../entities/comment'

export const commentCreated = (comment: Comment, boardId: number): RealTimeEvent => (
    {
        type: 'create-comment',
        about: {
            object: 'board',
            id: boardId
        },
        payload: comment
    }
)

export const commentDeleted = (comment: Comment, boardId: number): RealTimeEvent => (
    {
        type: 'delete-comment',
        about: {
            object: 'board',
            id: boardId
        },
        payload: comment
    }
)
