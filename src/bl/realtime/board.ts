import { RealTimeEvent } from '../realtimeFacade'

import { Board } from '../../entities/board'
import { Requester } from '../requester'

export const boardUpdated = (requester: Requester, board: Board): RealTimeEvent => (
    {
        type: 'update-board',
        about: {
            object: 'board',
            id: board.id
        },
        payload: {
            board,
            requester: requester.getUID()
        }
    }
)
