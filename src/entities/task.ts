import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { TaskList } from './taskList'

@Entity()
export class Task {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    title: string

    @Column('text')
    description: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToOne(type => TaskList, taskList => taskList.tasks) // ManyToOne betwen Task and TaskList
    tasksList: TaskList[]

 }
