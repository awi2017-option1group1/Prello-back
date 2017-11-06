import * as express from 'express'

import { CardFacade } from '../../bl/cardFacade'
import { AttachmentFacade } from '../../bl/attachmentFacade'
import { TaskListFacade } from '../../bl/taskListFacade'

export class Card {

    // --------------- Card ---------------

    static async getAllFromListId(req: express.Request, res: express.Response) {
        try {
            const cards = await CardFacade.getAllFromListId(req.params.id)
            res.status(200).json(cards)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.getById(req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(card)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.delete(req.params.id)
            // req.params.id is the id of the card
            if (card) {
                res.status(200).json(card)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.update(req.body, req.params.id)
            res.status(200).json(card)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.create(req.body, req.params.id)
            res.status(200).json(card)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    // --------------- Attachment ---------------

    static async getAllAttachments(req: express.Request, res: express.Response) {
        try {
            const Attachment = await AttachmentFacade.getAllFromCardId(req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(Attachment)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async createAttachment(req: express.Request, res: express.Response) {
        try {
            const Attachment = await AttachmentFacade.createByCardId(req.body, req.params.id)
            // req.params.id is the id of the card, req.body is an attachment to link to the card
            res.status(200).json(Attachment)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    // --------------- Checklist ---------------

    static async getAllChecklists(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.getAllFromCardId(req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async createChecklist(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.create(req.body, req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    // --------------- Members ---------------

    static async getAllMembers(req: express.Request, res: express.Response) {
        try {
            const members = await CardFacade.getAllMembersFromCardId(req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(members)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async assignMember(req: express.Request, res: express.Response) {
        try {
            const user = await CardFacade.assignMember(req.body, req.params.id) 
            // req.params.id is the id of the card, req.body is a user
            res.status(200).json(user)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async unassignMemberById(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.unassignMemberById(req.params.id, req.params.idMember)
            // req.params.id is the id of the card, req.params.idMember is the id of the user to delete
            if (card) {
                res.status(200).json(card)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    // --------------- Labels ---------------

    static async getAllLabels(req: express.Request, res: express.Response) {
        try {
            const labels = await CardFacade.getAllLabelsFromCardId(req.params.id)
            // req.params.id is the id of the card
            res.status(200).json(labels)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async assignLabel(req: express.Request, res: express.Response) {
        try {
            const label = await CardFacade.assignLabel(req.body, req.params.id) 
            // req.params.id is the id of the card, req.body is a label
            res.status(200).json(label)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async unassignLabelById(req: express.Request, res: express.Response) {
        try {
            const card = await CardFacade.unassignLabelById(req.params.id, req.params.idLabel)
            // req.params.id is the id of the card, req.params.idLabelr is the id of the label to delete
            if (card) {
                res.status(200).json(card)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }
}
