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

    @Column({
        type: 'text',
        length: 500
    })
    description: string

    @Column({
        type: 'date'
    })
    dueDate: Date

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Tag, tag => tag.cards)   // ManyToMany betwen Tag and Card
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

    @ManyToOne(type => List, list => list.cards) // ManyToOne betwen Card and List
    list: List

    @OneToMany(type => TaskList, taskList => taskList.card) // OneToMany betwen Card and TaskList
    tasksList: TaskList[]

    @OneToMany(type => Comment, comment => comment.card) // One Card to many Comments
    comments: Comment[]

    @OneToMany(type => Attachment, attachment => attachment.card )// One Card to many Attchments
    attachments: Attachment[]
 }
