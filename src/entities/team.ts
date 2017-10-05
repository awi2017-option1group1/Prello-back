import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { User } from './user'
@Entity()
export class Team {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string

    @Column('text')
    description: string

    @Column('boolean')
    isPrivate: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------

    @ManyToMany(type => User, user => user.teams)
    users: User[]
 }
