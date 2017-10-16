import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { Team } from './team'
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
    title: string

    @Column('boolean')
    isPrivate: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => Team, team => team.users)
    team: Team

    @ManyToMany(type => User, user => user.boards)
    @JoinTable({
        name: 'user_board',
        joinColumn: {
            name: 'board',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id'
        },
    })
    users: User[]

    @OneToMany(type => List, list => list.board)
    lists: List[]

    @ManyToMany(type => Tag, tag => tag.boards)
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
