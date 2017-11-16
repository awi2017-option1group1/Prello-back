import * as express from 'express'

import { isInteger } from '../../util'

import { CardFacade } from '../../bl/cardFacade'
import { TagFacade } from '../../bl/tagFacade'

export class Card {

    // --------------- Card ---------------

    static async getAllFromListId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.listId)) {
                const cards = await CardFacade.getAllFromListId(req.requester, req.params.listId)
                res.status(200).json(cards)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const card = await CardFacade.getById(req.params.cardId)
                res.status(200).json(card)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async insertFromListId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.listId)) {
                const card = await CardFacade.insertFromListId(req.requester, req.params.listId, req.body)
                res.status(201).json(card)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const card = await CardFacade.update(req.requester, req.params.cardId, req.body)
                res.status(200).json(card)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({ error: e.message })
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                await CardFacade.delete(req.requester, req.params.cardId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    // --------------- Members ---------------

    static async getAllMembers(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const members = await CardFacade.getAllMembersFromCardId(req.requester, req.params.cardId)
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
            if (isInteger(req.params.cardId)) {
                const user = await CardFacade.assignMember(req.requester, req.params.cardId, req.body)
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
            if (isInteger(req.params.cardId) && isInteger(req.params.memberId)) {
                await CardFacade.unassignMemberById(req.requester, req.params.cardId, req.params.memberId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameters' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    // --------------- Labels ---------------

    static async getAllLabels(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const labels = await TagFacade.getAllFromCardId(req.requester, req.params.cardId)
                res.status(200).json(labels)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async assignLabel(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const label = await CardFacade.assignLabel(req.requester, req.params.cardId, req.body) 
                res.status(200).json(label)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async unassignLabelById(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId) && isInteger(req.params.labelId)) {
                await CardFacade.unassignLabelById(req.requester, req.params.cardId, req.params.labelId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameters' })
            }      
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }
}
