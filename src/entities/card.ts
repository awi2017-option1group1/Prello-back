import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { Tag } from './tag'
import { List } from './list'
import { TaskList } from './taskList'
import { Comment } from './comment'
import { Attachement } from './attachement'

@Entity()
export class Card {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    title: string

    @Column({
        type: 'text',
        nullable: true
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

    @OneToMany(type => Attachement, attachement => attachement.card )
    attachements: Attachement[]
 }
