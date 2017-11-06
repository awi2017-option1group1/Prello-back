import * as express from 'express'

import { TaskFacade } from '../../bl/taskFacade'

export class Task {

    static async getAllFromTaskListId(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.getAllFromTaskListId(req.params.id)
            // req.params.id is the id of the Task
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.getById(req.params.id)
            // req.params.id is the id of the Task
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await TaskFacade.delete(req.params.id)
            // req.params.id is the id of the Task
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
            const task = await TaskFacade.update(req.body, req.params.id)
            // req.params.id is the id of the Task, req.body contains the new task
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const task = await TaskFacade.create(req.body, req.params.id)
            // req.params.id is the id of the Task
            res.status(200).json(task)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
