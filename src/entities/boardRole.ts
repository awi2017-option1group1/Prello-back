import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BoardRole {
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
