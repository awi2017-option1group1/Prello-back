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

    @Column({
        type: 'text',
        length: 25
    })
    label: string

    @Column({
        type: 'text',
        length: 25
    })
    color: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Card, card => card.tags)
    cards: Card[]

    @ManyToMany(type => Board, board => board.tags)
    boards: Board[]
 }
