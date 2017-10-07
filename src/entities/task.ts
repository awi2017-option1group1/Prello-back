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
        type: 'text',
        length: 25
    })
    title: string

    @Column({
        type: 'text',
        length: 500
    })
    description: string

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
    tasksList: TaskList[]
 }
