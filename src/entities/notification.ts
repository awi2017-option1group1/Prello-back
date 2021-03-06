import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './user'

@Entity()
export class Notification {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    type: string

    @Column('int')
    about: number

    @Column('int')
    from: number

    @Column('timestamp')
    date: Date

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => User, user => user.notifications)
    user: User
 }
