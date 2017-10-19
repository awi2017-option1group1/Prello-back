import { getEntityManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Task } from '../entities/task'
import { ParamsExtractor } from './paramsExtractor'

export class TaskFacade {

    static async getAllFromTaskListId(taskListId: number): Promise<Task[]> {
        const tasks = await getEntityManager()
                            .getRepository(Task)
                            .find({
                                    taskTist: taskListId
                            })
        if (tasks) {
            return tasks
        } else {
            throw new NotFoundException('No Task was found')
        }
    }

    static async getById(taskId: number): Promise<Task> {
        const task = await getEntityManager()
                            .getRepository(Task)
                            .findOneById(taskId)
        if (task) {
            return task
        } else {
            throw new NotFoundException('No Task was found')
        }
    }

    static async delete(taskId: number): Promise<boolean> {
        try {
            const taskToDelete = await TaskFacade.getById(taskId)
            const deletedTask = await getEntityManager()
                    .getRepository(Task)
                    .remove(taskToDelete)
            if (deletedTask) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(taskReceived: Task, taskToUpdate: Task): Promise<Task> {
        try {
            const taskToSave = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'],
                                                             taskReceived, taskToUpdate)
            const repository = getEntityManager().getRepository(Task)
            return repository.persist(taskToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(task: Task, taskListId: number): Promise<Task> {
        try {
            let taskToCreate = new Task()
            taskToCreate = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'], 
                                                         task, taskToCreate)
            return getEntityManager().getRepository(Task).persist(taskToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
