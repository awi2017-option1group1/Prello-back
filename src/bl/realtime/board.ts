import { RealTimeEvent } from '../realtimeFacade'

import { Board } from '../../entities/board'

export const boardUpdated = (board: Board): RealTimeEvent => (
    {
        type: 'update-board',
        about: {
            object: 'board',
            id: board.id
        },
        payload: board
    }
)
