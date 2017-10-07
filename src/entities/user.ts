import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm'
import { Team } from './team'
import { Board } from './board'
import { Notification } from './notification'
import { Comment } from './comment'
import { Token } from './token'

@Entity()
export class User {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    lastname: string

    @Column('text')
    firstname: string

    @Column({
        type: 'text',
        unique: true
    })
    pseudo: string

    @Column('text')
    biography: string

    @Column('boolean')
    notificationsEnabled: boolean

    @Column({
        type: 'text',
        unique: true
    })
    email: string

    @Column('text')
    password: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Team, team => team.users)
    @JoinTable({
        name: 'user_team',
        joinColumn: {
            name: 'user',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'team',
            referencedColumnName: 'id'
        },
    })
    teams: Team[]

    @ManyToMany(type => Board, board => board.users)
    boards: Board[]

    @OneToMany(type => Notification, notification => notification.id)
    notifications: Notification[]

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment

    @OneToMany(type => Token, token => token.user)
    tokens: Token[]
 }
