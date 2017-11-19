import { RealTimeEvent } from '../realtimeFacade'

import { Card } from '../../entities/card'
import { User } from '../../entities/user'
import { Requester } from '../requester'

export const cardMemberAssigned = (requester: Requester, boardId: number, card: Card, member: User): RealTimeEvent => (
    {
        type: 'assign-card-member',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            card,
            member,
            requester: requester.getUID()
        }
    }
)

export const cardMemberUnassigned = (requester: Requester, boardId: number, card: Card, member: User): 
RealTimeEvent => (
    {
        type: 'unassign-card-member',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            card,
            member,
            requester: requester.getUID()
        }
    }
)
