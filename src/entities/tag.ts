import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm'
import { IsIn } from 'class-validator'

import { Card } from './card'
import { Board } from './board'

export const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black'
]

export const randomColor = () => {
    return colors[Math.floor((Math.random() * colors.length))]
}

@Entity()
export class Tag {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    name: string

    @IsIn(colors)
    @Column('varchar')
    color: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Card, card => card.tags)
    cards: Card[]

    @ManyToOne(type => Board, board => board.tags)
    board: Board
 }
