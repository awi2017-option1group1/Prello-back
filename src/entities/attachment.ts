import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Card } from './card'

@Entity()
export class Attachment {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    type: string

    @Column('text')
    URL: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToOne(type => Card, card => card.attachments) // Many Attachment to One Card
    card: Card

 }
