import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsIn } from 'class-validator'

const roles = ['Admin', 'Normal']

@Entity()
export class TeamRole {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @IsIn(roles)
    @Column('string')
    role: string

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
 }
