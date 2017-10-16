import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Card } from './card'
import { Task } from './task'

@Entity()
export class TaskList {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
    })
    title: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.tasksList)
    card: Card

    @OneToMany(type => Task, task => task.taskList)
    tasks: Task[]
 }
