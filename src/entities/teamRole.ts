import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

enum Role {
    Admin = 'admin',
    Normal = 'normal',
}

@Entity()
export class TeamRole {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: Role

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
 }
