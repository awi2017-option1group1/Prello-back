import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { Tag } from './tag'
import { List } from './list'
import { TaskList } from './taskList'
import { Comment } from './comment'
import { Attachment } from './attachment'
import { User } from './user'

@Entity()
export class Card {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    name: string

    @Column('boolean')
    closed: boolean

    @Column({
        type: 'text',
        nullable: true
    })
    desc: string

    @Column({
        type: 'date'
    })
    due: Date
    
    @Column({
        type: 'date'
    })
    dueComplete: Date

    @Column('int')
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
    tags: Promise<Tag[]>

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
    members: Promise<User[]>

    @ManyToOne(type => List, list => list.cards)
    list: List

    @OneToMany(type => TaskList, taskList => taskList.card)
    tasksLists: Promise<TaskList[]>

    @OneToMany(type => Comment, comment => comment.card)
    comments: Promise<Comment[]>

    @OneToMany(type => Attachment, attachment => attachment.card)
    attachments: Promise<Attachment[]>
 }
