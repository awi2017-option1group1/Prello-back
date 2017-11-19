import { RealTimeEvent } from '../realtimeFacade'

import { List } from '../../entities/list'
import { Requester } from '../requester'

export const listCreated = (requester: Requester, list: List, boardId: number): RealTimeEvent => (
    {
        type: 'create-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            list,
            requester: requester.getUID()
        }
    }
)

export const listUpdated = (requester: Requester, list: List, boardId: number): RealTimeEvent => (
    {
        type: 'update-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            list,
            requester: requester.getUID()
        }
    }
)

export const listDeleted = (requester: Requester, list: List, boardId: number): RealTimeEvent => (
    {
        type: 'delete-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            list,
            requester: requester.getUID()
        }
    }
)
