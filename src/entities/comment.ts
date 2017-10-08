import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Card } from './card'
import { User } from './user'

@Entity()
export class Comment {
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
        type: 'date'
    })
    date: Date

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.list)
    card: Card

    @ManyToOne(type => User, user => user.comments)
    user: User
 }
