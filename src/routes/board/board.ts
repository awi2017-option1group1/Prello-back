import * as express from 'express'

import { isInteger } from '../../util'

import { BoardFacade } from '../../bl/boardFacade'
import { ListFacade } from '../../bl/listFacade'

export class Board {

    static async getAllFromUserId(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAllFromUserId(req.requester, req.params.userId)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const board = await BoardFacade.getById(req.requester, req.params.boardId)
                res.status(200).json(board)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getBoardLists(req: express.Request, res: express.Response) {
        try {
            const lists = await ListFacade.getAllFromBoardId(req.requester, req.params.boardId)
            res.status(200).json(lists)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getBoardMembers(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.getById(req.requester, req.params.boardId)
            const lists = await board.users
            res.status(200).json(lists)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.create(req.requester, req.body)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.update(req.body, req.params.boardId, req.requester)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.delete(req.requester, req.params.boardId)
            if (board) {
                res.status(200).json(board)
            } else {
                res.status(404).json({ error : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    // --------------- Members ---------------

    static async getAllMembers(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const members = await BoardFacade.getAllMembersFromBoardId(req.params.boardId)
                res.status(200).json(members)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async assignMember(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const user = await BoardFacade.assignMember(req.params.boardId, req.body)
                res.status(200).json(user)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async unassignMemberById(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId) && isInteger(req.params.memberId)) {
                await BoardFacade.unassignMemberById(req.params.boardId, req.params.memberId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameters' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

}
