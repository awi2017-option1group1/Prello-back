import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { User } from './user'

@Entity()
export class Token {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryColumn('int')
    userid: number

    @PrimaryColumn('varchar')
    clientType: string

    @Column('text')
    value: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => User, user => user.tokens)
    user: User
 }
