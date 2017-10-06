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
        type: 'text',
        length: 25
    })
    title: string

    @Column({
        type: 'int',
    })
    rank: number

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @OneToMany(type => Card, card => card.list) // OneToMany betwen List and Card
    cards: Card[]

    @ManyToOne(type => Board, board => board.lists) // Many Lists to one Board
    board: Board
 }
