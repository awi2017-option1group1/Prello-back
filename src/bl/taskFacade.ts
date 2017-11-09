import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Task } from '../entities/task'
import { CheckListFacade } from './checkListFacade'
import { ParamsExtractor } from './paramsExtractor'

export class TaskFacade {

    static async getAllFromTaskListId(taskListId: number): Promise<Task[]> {
        const taskList = await CheckListFacade.getById(taskListId)
        const tasks = taskList.tasks
        if (tasks) {
            return tasks
        } else {
            throw new NotFoundException('No Task was found')
        }
    }

    static async getById(taskId: number): Promise<Task> {
        const task = await getManager()
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
            const deletionSuccess = await getManager()
                    .getRepository(Task)
                    .removeById(taskId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(taskReceived: Task, taskListId: number): Promise<void> {
        try {
            const taskToSave = ParamsExtractor.extract<Task>(
                ['name', 'pos', 'state'], taskReceived)
            const repository = getManager().getRepository(Task)
            return repository.updateById(taskListId, taskToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(task: Task, taskListId: number): Promise<Task> {
        try {
            let taskToCreate = ParamsExtractor.extract<Task>(
                ['name', 'pos', 'state'], task)
            taskToCreate.checkList = await CheckListFacade.getById(taskListId)
            return getManager().getRepository(Task).create(taskToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
