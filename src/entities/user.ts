import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm'
import { Team } from './team'
import { TeamRole } from './teamRole'
import { Board } from './board'
import { Notification } from './notification'
import { Comment } from './comment'
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

    @Column('text')
    pseudo: string

    @Column('text')
    biography: string

    @Column('boolean')
    notificationsEnabled: boolean

    @Column('text')
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
    teamRole: TeamRole

    @ManyToMany(type => Board, board => board.users)
    boards: Board[]

    @OneToMany(type => Notification, notification => notification.id)
    notifications: Notification[]
 
    @OneToMany(type => Comment, comment => comment.user) // Many Comments to One User
    comments: Comment
 }
