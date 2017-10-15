import * as express from 'express'

import { TaskListFacade } from '../../bl/taskListFacade'

export class TaskList {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.getAllFromCardId(req.params.card_id)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.getById(req.params.taskList_id)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await TaskListFacade.delete(req.params.taskList_id)
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
            const taskListToUpdate = await TaskListFacade.getById(req.body.id)
            const taskList = await TaskListFacade.update(req.body, taskListToUpdate)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const taskList = await TaskListFacade.create(req.body, req.params.taskList_id)
            res.status(200).json(taskList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
