import { getManager } from 'typeorm'

import { TaskNotFoundException } from './errors/TaskNotFoundException'
import { Task } from '../entities/task'
import { TaskListFacade } from './taskListFacade'
import { ParamsExtractor } from './paramsExtractor'

export class TaskFacade {

    static async getAllFromTaskListId(taskListId: number): Promise<Task[]> {
        const taskList = await TaskListFacade.getById(taskListId)
        const tasks = taskList.tasks
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
            const deletionSuccess = await getManager()
                    .getRepository(Task)
                    .removeById(taskId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }

    static async update(taskReceived: Task): Promise<void> {
        try {
            const taskToSave = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'], taskReceived)
            const repository = getManager().getRepository(Task)
            return repository.updateById(taskReceived.id, taskToSave)
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }

    static async create(task: Task, taskListId: number): Promise<Task> {
        try {
            let taskToCreate = ParamsExtractor.extract<Task>(['title', 'rank', 'isDone', 'taskList'], task)
            taskToCreate.taskList = await TaskListFacade.getById(taskListId)
            return getManager().getRepository(Task).create(taskToCreate)
        } catch (e) {
            throw new TaskNotFoundException(e)
        }
    }
}
