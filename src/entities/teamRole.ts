import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class TeamRole {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    role: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
 }
