import * as express from 'express'
import { isInteger } from '../../util'

import { CheckListFacade } from '../../bl/checkListFacade'
import { TaskFacade } from '../../bl/taskFacade'

export class CheckList {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const checkList = await CheckListFacade.getAllFromCardId(req.params.id)
            res.status(200).json(checkList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const checkList = await CheckListFacade.getById(req.params.id)
            // req.params.id is the id of the TaskList
            res.status(200).json(checkList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getAllCheckItems(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.getAllFromTaskListId(req.params.id)
            // req.params.id is the id of the TaskList
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await CheckListFacade.delete(req.params.id)
            // req.params.id is the id of the TaskList
            if (deletionSuccess) {
                res.status(200).json(deletionSuccess)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.id)) {
                const checkList = await CheckListFacade.update(req.params.id, req.body)
                res.status(200).json(checkList)
            } else {
                res.status(400).json({ error: 'Invalid request parameter : ' + req.params.id })
            }
            // const checkListToUpdate = await CheckListFacade.getById(req.params.id)
            // req.params.id is the id of the CheckList
            // const checkList = await CheckListFacade.update(req.body, checkListToUpdate)
            // req.body contains the new list
            // res.status(200).json(checkList)
        } catch (e) {
            // res.status(404).json({ message: 'UPDATE : ' + req.params.id})
            res.status(404).json({ message: e.message})
        }
    }

    static async createCheckItem(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.create(req.body, req.params.id)
            // req.params.id is the id of the TaskList,
            // req.body contains the new task to insert on the taskList
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
