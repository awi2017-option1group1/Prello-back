import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { User } from './user'
import { List } from './list'
import { Tag } from './tag'

@Entity()
export class Board {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    name: string

    @Column('boolean')
    isPrivate: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToMany(type => User, user => user.boards)
    @JoinTable()
    users: User[]

    @OneToMany(type => List, list => list.board)
    lists: Promise<List[]>

    @OneToMany(type => Tag, tag => tag.board)
    @JoinTable({
        name: 'board_tag',
        joinColumn: {
            name: 'board',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag',
            referencedColumnName: 'id'
        },
    })
    tags: Tag[]
 }
