import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { TaskList } from './taskList'

@Entity()
export class Task {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'string'
    })
    title: string

    @Column({
        type: 'int'
    })
    rank: number

    @Column({
        type: 'boolean'
    })
    isDone: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => TaskList, taskList => taskList.tasks)
    taskList: TaskList
 }
