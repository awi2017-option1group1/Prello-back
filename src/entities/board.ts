import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import { Team } from './team'
import { User } from './user'
import { BoardRole } from './boardRole'
@Entity()
export class Board {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    title: string

    @Column('boolean')
    isPrivate: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @OneToOne(type => Team)
    @JoinColumn()
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
    boardRole: BoardRole
 }
