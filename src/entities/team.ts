import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm'
import { Board } from './board'
import { User } from './user'
@Entity()
export class Team {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        unique: true
    })
    name: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    description: string

    @Column('boolean')
    isPrivate: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToMany(type => User, user => user.teams)
    users: User[]

    @OneToMany(type => Board, board => board.team)
    boards: Board[]
 }
