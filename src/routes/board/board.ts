import * as express from 'express'

import { ParamsExtractor } from '../../bl/paramsExtractor'
import { BoardFacade } from '../../bl/boardFacade'

export class Board {
    static async getAll(req: express.Request, res: express.Response) {
        try {
            const boards = await BoardFacade.getAll()
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

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
            const boards = await BoardFacade.getAllFromTeamId(req.params.user_id)
            res.status(200).json(boards)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.getAllFromTeamId(req.params.board_id)
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
            req = ParamsExtractor.extract(['title', 'isPrivate'], req)
            const board = await BoardFacade.update(req.params.board)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const board = await BoardFacade.create(req.params.board)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }}
