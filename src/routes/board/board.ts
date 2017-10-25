import * as express from 'express'

import { BoardFacade } from '../../bl/boardFacade'
import { ListFacade } from '../../bl/listFacade'

export class Board {

    static async getAllFromTeamId(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAllFromTeamId(req.params.team_id)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getAllFromUserId(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAllFromUserId(req.params.user_id)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.getById(req.params.board_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getBoardLabels(req: express.Request, res: express.Response) {
        try {
            // TODO WHEN labelFacade IS DONE
            res.status(200).json('A lot of labels')
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getBoardLists(req: express.Request, res: express.Response) {
        try {
            const lists = await ListFacade.getAllFromBoardId(req.params.board_id)
            res.status(200).json(lists)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getBoardMembers(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.getById(req.params.board_id)
            const lists = await board.users
            res.status(200).json(lists)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.delete(req.params.board_id)
            if (board) {
                res.status(200).json(board)
            } else {
                res.status(404).json({ error : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const board = BoardFacade.update(req.body, req.params.board_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    /*static async updateBoardMembers(req: express.Request, res: express.Response) {
        try {
            const board = BoardFacade.updateBoardMembers(req.body, req.params.board_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async updateBoardMember(req: express.Request, res: express.Response) {
        try {
            const board = BoardFacade.updateBoardMember(req.body, req.params.board_id, req.params.member_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }*/

    static async create(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.create(req.body)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async addLabel(req: express.Request, res: express.Response) {
        try {
            const success = await BoardFacade.addLabel(req.body, req.params.board_id)
            if (success) {
                res.status(200)
            } else {
                res.status(404).json({ error : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async addList(req: express.Request, res: express.Response) {
        try {
            const success = await BoardFacade.addList(req.body, req.params.board_id)
            if (success) {
                res.status(200)
            } else {
                res.status(404).json({ error : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }
}
