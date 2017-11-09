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

    @Column('text')
    @IsFQDN()
    URL: string

    @Column('int')
    pos: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column({
        type: 'date'
    })
    date: Date

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.attachments)
    card: Card
 }
