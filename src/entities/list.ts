import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'

import { Card } from './card'
import { Board } from './board'

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column({
        type: 'int',
    })
    pos: number

    @OneToMany(type => Card, card => card.list)
    cards: Card[]

    @ManyToOne(type => Board, board => board.lists, {
        onDelete: 'CASCADE'
    })
    board: Board
 }
