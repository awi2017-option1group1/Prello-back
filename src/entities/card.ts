import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { Tag } from './tag'
import { List } from './list'
import { CheckList } from './checkList'
import { Comment } from './comment'
import { User } from './user'

@Entity()
export class Card {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar'
    })
    name: string

    @Column({
        type: 'boolean',
        default: false
    })
    closed: boolean

    @Column({
        type: 'text',
        nullable: true
    })
    desc: string

    @Column({
        type: 'date',
        nullable: true
    })
    due: Date

    @Column({
        type: 'date',
        nullable: true
    })
    dueComplete: Date

    @Column({
        type: 'int'
    })
    pos: number

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Tag, tag => tag.cards)
    @JoinTable({
        name: 'card_tags',
        joinColumn: {
            name: 'card',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag',
            referencedColumnName: 'id'
        },
    })
    tags: Tag[]

    @ManyToMany(type => User, user => user.cards)
    @JoinTable({
        name: 'card_users',
        joinColumn: {
            name: 'card',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id'
        },
    })
    members: User[]

    @ManyToOne(type => List, list => list.cards)
    list: List

    @OneToMany(type => CheckList, checkList => checkList.card)
    checkLists: CheckList[]

    @OneToMany(type => Comment, comment => comment.card)
    comments: Comment[]
 }
