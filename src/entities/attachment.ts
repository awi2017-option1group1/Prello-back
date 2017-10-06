import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IsFQDN } from 'class-validator'
import { Card } from './card'

@Entity()
export class Attachment {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'text',
        length: 500
    })
    type: string

    @Column('text')
    @IsFQDN()
    URL: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.attachments) // Many Attachment to One Card
    card: Card
 }