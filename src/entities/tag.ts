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
        type: 'varchar',
    })
    label: string

    @IsIn(colors)
    @Column('varchar')
    color: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Card, card => card.tags, {
        eager: true
    })
    cards: Card[]

    @ManyToMany(type => Board, board => board.tags, {
        eager: true
    })
    boards: Board[]
 }
