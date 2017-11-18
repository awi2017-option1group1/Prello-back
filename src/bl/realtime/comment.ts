import { RealTimeEvent } from '../realtimeFacade'

import { Comment } from '../../entities/comment'

export const commentCreated = (comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'create-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: comment
    }
)

export const commentUpdated = (comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'update-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: comment
    }
)

export const commentDeleted = (comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'delete-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: comment
    }
)
