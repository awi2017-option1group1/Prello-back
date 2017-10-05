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

    @Column('text')
    title: string

    @Column('text')
    description: string
    
    @Column('boolean')
    isDone: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToOne(type => Card, card => card.tasksList) // ManyToOne betwen TaskList and Card
    card: Card

    @OneToMany(type => Task, task => task.tasksList) // OneToMany betwen Card and TaskList
    tasks: Task[]

 }
