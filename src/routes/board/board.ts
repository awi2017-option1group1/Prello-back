import * as express from 'express'

import { BoardFacade } from '../../bl/boardFacade'

export class Board {

    static async getAllFromTeamId(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAllFromTeamId(req.params.team_id)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getAllFromUserId(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAllFromUserId(req.params.user_id)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.getById(req.params.board_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.delete(req.params.board_id)
            if (board) {
                res.status(200).json(board)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const boardToUpdate = await BoardFacade.getById(req.body.id)
            const board = BoardFacade.update(req.body, boardToUpdate)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.create(req.body)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }}
