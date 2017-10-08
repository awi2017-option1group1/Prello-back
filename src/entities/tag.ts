import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { Card } from './card'
import { Board } from './board'

enum Color {
    SILVER = '#C0C0C0',
    GRAY = '#808080',
    BLACK = '#000000',
    RED	= '#FF0000',
    MAROON = '#800000',
    YELLOW = '#FFFF00',
    OLIVE = '#808000',
    LIME = '#00FF00',
    GREEN = '#008000',
    AQUA = '#00FFFF',
    TEAL = '#008080',
    BLUE = '#0000FF',
    NAVY = '#000080',
    FUCHSIA = '#FF00FF',
    PURPLE = '#800080'
}

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

    @Column()
    color: Color

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Card, card => card.tags)
    cards: Card[]

    @ManyToMany(type => Board, board => board.tags)
    boards: Board[]
 }
