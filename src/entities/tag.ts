import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm'
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
    @ManyToMany(type => Card, card => card.tags)
    cards: Promise<Card[]>

    @ManyToOne(type => Board, board => board.tags, )
    board: Promise<Board[]>
 }
