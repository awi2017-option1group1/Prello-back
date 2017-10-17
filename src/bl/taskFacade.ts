import { getManager } from 'typeorm'

import { TaskNotFoundException } from './errors/TaskNotFoundException'
import { Task } from '../entities/task'
import { ParamsExtractor } from './paramsExtractor'

export class TaskFacade {

    static async getAllFromTaskListId(taskListId: number): Promise<Task[]> {
        const tasks = await getManager()
                            .getRepository(Task)
                            .find()
        if (tasks) {
            return tasks
        } else {
            throw new TaskNotFoundException('No Task was found')
        }
    }

    static async getById(taskId: number): Promise<Task> {
        const task = await getManager()
                            .getRepository(Task)
                            .findOneById(taskId)
        if (task) {
            return task
        } else {
            throw new TaskNotFoundException('No Task was found')
        }
    }

    static async delete(taskId: number): Promise<boolean> {
        try {
            const taskToDelete = await TaskFacade.getById(taskId)
            const deletionSuccess = await getManager()
                    .getRepository(Task)
                    .remove(taskToDelete)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }

    static async update(taskReceived: Task, taskToUpdate: Task): Promise<Task> {
        try {
            const taskToSave = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'],
                                                             taskReceived, taskToUpdate)
            const repository = getManager().getRepository(Task)
            return repository.save(taskToSave)
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }

    static async create(task: Task, taskListId: number): Promise<Task> {
        try {
            let taskToCreate = new Task()
            taskToCreate = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'],
                                                         task, taskToCreate)
            return getManager().getRepository(Task).save(taskToCreate)
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }
}
