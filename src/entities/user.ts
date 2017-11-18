import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm'
import { Length, IsAlphanumeric, IsEmail } from 'class-validator'

import { IsUnique } from '../validators/IsUniqueValidator'

import { Board } from './board'
import { Notification } from './notification'
import { Comment } from './comment'
import { Card } from './card'

export const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink'
]

export const randomColor = () => {
    return colors[Math.floor((Math.random() * colors.length))]
}

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
        nullable: true,
        select: false
    })
    password: string | null

    @Column({
        type: 'boolean',
        default: false
    })
    confirmed: boolean

    @Column({
        type: 'varchar',
        nullable: true
    })
    confirmationToken: string | null

    @Column({
        type: 'varchar'
    })
    avatarColor: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => Board, board => board.users)
    boards: Board[]

    @OneToMany(type => Notification, notification => notification.user)
    notifications: Promise<Notification[]>

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[]

    @ManyToMany(type => Card, card => card.members)
    cards: Card[]
 }
