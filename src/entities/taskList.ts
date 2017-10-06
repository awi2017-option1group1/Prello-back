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
        type: 'boolean'
    })
    isDone: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.tasksList) // ManyToOne betwen TaskList and Card
    card: Card

    @OneToMany(type => Task, task => task.tasksList) // OneToMany betwen Card and TaskList
    tasks: Task[]
 }
