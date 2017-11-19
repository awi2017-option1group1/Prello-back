import { RealTimeEvent } from '../realtimeFacade'

import { Card } from '../../entities/card'
import { Tag } from '../../entities/tag'
import { Requester } from '../requester'

export const tagCreated = (requester: Requester, tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'create-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            requester: requester.getUID()
        }
    }
)

export const tagUpdated = (requester: Requester, tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'update-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            requester: requester.getUID()
        }
    }
)

export const tagDeleted = (requester: Requester, tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'delete-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            requester: requester.getUID()
        }
    }
)

export const tagAssigned = (requester: Requester, tag: Tag, card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'assign-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            card,
            requester: requester.getUID()
        }
    }
)

export const tagUnassigned = (requester: Requester, tag: Tag, card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'unassign-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            card,
            requester: requester.getUID()
        }
    }
)
