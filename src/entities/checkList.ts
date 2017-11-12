import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Card } from './card'
import { CheckItem } from './checkItem'

@Entity()
export class CheckList {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column('int')
    pos: number

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Card, card => card.checkLists)
    card: Card

    @OneToMany(type => CheckItem, checkItem => checkItem.checkList)
    checkItems: CheckItem[]
 }
