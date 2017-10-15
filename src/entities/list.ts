import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import { Card } from './card'
import { Board } from './board'

@Entity()
export class List {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'string',
    })
    title: string

    @Column({
        type: 'int',
    })
    rank: number

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @OneToMany(type => Card, card => card.list)
    cards: Card[]

    @ManyToOne(type => Board, board => board.lists)
    board: Board
 }
