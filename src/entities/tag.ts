import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { Card } from './card'
import { Board } from './board'

@Entity()
export class Tag {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    label: string

    @Column('text')
    color: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToMany(type => Card, card => card.tags, {  
        cascadeInsert: true, 
        cascadeUpdate: true 
    })
    cards: Card[]

    @ManyToMany(type => Board, board => board.tags)
    boards: Board[]

 }
