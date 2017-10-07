import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { Tag } from './tag'
import { List } from './list'
import { TaskList } from './taskList'
import { Comment } from './comment'
import { Attachment } from './attachment'

@Entity()
export class Card {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    title: string

    @Column({
        type: 'text',
        length: 500
    })
    description: string

    @Column({
        type: 'date'
    })
    dueDate: Date

    @Column('int')
    rank: number

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

    @ManyToOne(type => List, list => list.cards)
    list: List

    @OneToMany(type => TaskList, taskList => taskList.card)
    tasksList: TaskList[]

    @OneToMany(type => Comment, comment => comment.card)
    comments: Comment[]

    @OneToMany(type => Attachment, attachment => attachment.card )
    attachments: Attachment[]
 }
