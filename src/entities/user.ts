import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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
 }
