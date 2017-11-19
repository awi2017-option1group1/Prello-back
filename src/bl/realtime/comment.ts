import { RealTimeEvent } from '../realtimeFacade'

import { Comment } from '../../entities/comment'
import { Requester } from '../requester'

export const commentCreated = (requester: Requester, comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'create-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            comment,
            requester: requester.getUID()
        }
    }
)

export const commentUpdated = (requester: Requester, comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'update-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            comment,
            requester: requester.getUID()
        }
    }
)

export const commentDeleted = (requester: Requester, comment: Comment, cardId: number): RealTimeEvent => (
    {
        type: 'delete-comment',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            comment,
            requester: requester.getUID()
        }
    }
)
