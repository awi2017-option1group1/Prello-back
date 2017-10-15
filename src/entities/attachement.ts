import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IsFQDN } from 'class-validator'
import { Card } from './card'

@Entity()
export class Attachement {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'string'
    })
    type: string

    @Column('text')
    @IsFQDN()
    URL: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.attachements)
    card: Card
 }
