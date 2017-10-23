import * as express from 'express'

import { TaskListFacade } from '../../bl/taskListFacade'
import { TaskFacade } from '../../bl/taskFacade'

export class TaskList {

    /* static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.getAllFromCardId(req.params.card_id)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    } */

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.getById(req.params.id)
            // req.params.id is the id of the TaskList
            res.status(200).json(taskList)
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
            const deletionSuccess = await TaskListFacade.delete(req.params.id)
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
            const taskListToUpdate = await TaskListFacade.getById(req.params.id)
            // req.params.id is the id of the TaskList
            const taskList = await TaskListFacade.update(req.body, taskListToUpdate)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async createCheckItem(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.create(req.body, req.params.id)
            // req.params.id is the id of the TaskList
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
