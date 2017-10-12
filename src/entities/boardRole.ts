import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsIn } from 'class-validator'
const roles = ['Admin', 'Owner', 'Editor', 'Viewer']

@Entity()
export class BoardRole {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @IsIn(roles)
    @Column('text')
    role: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
 }
