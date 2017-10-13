import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { IsIn } from 'class-validator'

import { Card } from './card'
import { Board } from './board'

const colors = ['blue', 'red', 'green', 'silver', 'yellow']

@Entity()
export class Tag {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'string',
    })
    label: string

    @IsIn(colors)
    @Column('string')
    color: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Card, card => card.tags)
    cards: Card[]

    @ManyToMany(type => Board, board => board.tags)
    boards: Board[]
 }
