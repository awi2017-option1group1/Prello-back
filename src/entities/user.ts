import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm'
import { Length, IsAlphanumeric, IsEmail } from 'class-validator'

import { IsUnique } from '../validators/IsUniqueValidator'

import { Team } from './team'
import { Board } from './board'
import { Notification } from './notification'
import { Comment } from './comment'
import { Token } from './token'
import { Card } from './card'

@Entity()
export class User {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: true
    })
    fullName: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    initial: string

    @IsUnique(
        {
            repository: User,
            column: 'username'
        },
        {
            message: 'Username already taken',
            groups: ['registration']
        }
    )
    @Length(3, 25, {
        message: 'Username must be between $constraint1 and $constraint2 characters long',
        groups: ['registration']
    })
    @IsAlphanumeric({
        message: 'Username must be composed only by alphanumeric values',
        groups: ['registration']
    })
    @Column({
        type: 'varchar',
        unique: true
    })
    username: string

    @Column({
        type: 'text',
        nullable: true
    })
    bio: string

    @Column({
        type: 'boolean',
        default: true
    })
    notificationsEnabled: boolean

    @IsUnique(
        {
            repository: User,
            column: 'email'
        },
        {
            message: 'Email already taken',
            groups: ['registration']
        }
    )
    @IsEmail({}, {
        message: 'Email must be a valid email',
        groups: ['registration']
    })
    @Column({
        type: 'varchar',
        unique: true
    })
    email: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    password: string | null

    @Column({
        type: 'boolean',
        default: false
    })
    confirmed: boolean

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
    teams: Promise<Team[]>

    @ManyToMany(type => Board, board => board.users)
    boards: Promise<Board[]>

    @OneToMany(type => Notification, notification => notification.user)
    notifications: Promise<Notification[]>

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment

    @OneToMany(type => Token, token => token.user)
    tokens: Promise<Token[]>

    @ManyToMany(type => Card, card => card.members)
    cards: Promise<Card[]>
 }
