import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BoardRole {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'text',
        unique: true
    })
    role: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
 }
