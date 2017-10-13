import * as express from 'express'

import { CardFacade } from '../../bl/cardFacade'

export class Card {

    static async getAllFromListId(req: express.Request, res: express.Response) {
        try {
            const cards = await CardFacade.getAllFromListId(req.params.list_id)
            res.status(200).json(cards)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const board = await CardFacade.getById(req.params.card_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.delete(req.params.card_id)
            if (card) {
                res.status(200).json(card)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const cardToUpdate = await CardFacade.getById(req.body.id)
            const card = await CardFacade.update(req.body, cardToUpdate)
            res.status(200).json(card)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.create(req.body, req.params.list_id)
            res.status(200).json(card)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }}
