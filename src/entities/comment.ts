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

    @Column('text')
    title: string

    @Column('int')
    rank: number

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.list) // Many Comments to One Card
    card: Card

    @ManyToOne(type => User, user => user.comments) // Many Comments to One User
    user: User

 }
