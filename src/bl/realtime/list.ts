import { RealTimeEvent } from '../realtimeFacade'

import { List } from '../../entities/list'

export const listCreated = (list: List, boardId: number): RealTimeEvent => (
    {
        type: 'create-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: list
    }
)

export const listUpdated = (list: List, boardId: number): RealTimeEvent => (
    {
        type: 'update-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: list
    }
)

export const listDeleted = (list: List, boardId: number): RealTimeEvent => (
    {
        type: 'delete-list',
        about: {
            object: 'board',
            id: boardId
        },
        payload: list
    }
)
