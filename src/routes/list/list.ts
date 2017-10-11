import * as express from 'express'

import { ListFacade } from '../../bl/listFacade'

export class List {
    static async getAllFromBoardId(req: express.Request, res: express.Response) {
        try {
            var boardId = req.params.board_id
            if (boardId == null) {
                res.status(400).json({ message: 'Request parameter invalide'}) 
            } else {
                // else if (forbidden : if the user appratient à la team alors c'est bon) res.status(403)
                // else if (Method Not Allowed) res.status(405)
                const lists = await ListFacade.getAllFromBoardId(req.params.board_id)
                res.status(200).json(lists)
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            var listId = req.params.list_id
            if (listId == null) {
                res.status(400).json({ message: 'Request parameter invalide'}) 
            } else {
                // else if (forbidden : if the user appratient à la team alors c'est bon) res.status(403)
                // else if (Method Not Allowed) res.status(405)
                const list = await ListFacade.getById(req.params.list_id)
                res.status(200).json(list) 
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async insertFromBoardId(req: express.Request, res: express.Response) {
        try {
            var boardId = req.params.board_id
            var listToInsert = req.body.list
            if (boardId == null) {
                res.status(400).json({ message: 'Request parameter invalide'}) 
            } else if (listToInsert.isEmpty) {
                res.status(400).json({ message: 'Request body to complete'}) 
            } else {
            // else if (forbidden : if the user appratient à la team alors c'est bon) res.status(403)
            // else if (Method Not Allowed) res.status(405)
                const list = await ListFacade.insertFromBoardId(req.params.board_id, req.body.list)
                res.status(200).json(list)
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
    
    static async update(req: express.Request, res: express.Response) {
        try {
            var list = req.body.list
            if (list == null) {
                res.status(400).json({ message: 'Request parameter invalide'}) 
            } else {
            // else if (forbidden : if the user appratient à la team alors c'est bon) res.status(403)
            // else if (Method Not Allowed) res.status(405)
                const UpdatedList = await ListFacade.update(req.body.list)
                if (UpdatedList == null) {
                    res.status(200).json(list) 
                } else {
                    res.status(202).json({ message: 'No content'})
                }
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            var listId = req.params.list_id
            if (listId == null) {
                res.status(400).json({ message: 'Request parameter invalide'}) 
            } else {
            // else if (forbidden : if the user appratient à la team alors c'est bon) res.status(403)
            // else if (Method Not Allowed) res.status(405)
                const list = await ListFacade.delete(req.params.list_id)
                if (list) {
                    res.status(204)
                }
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
