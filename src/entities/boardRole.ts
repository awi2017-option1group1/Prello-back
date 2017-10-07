import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

enum Role {
    Admin = 'admin',
    Owner = 'owner',
    Editor = 'editor',
    Viewer = 'Viewer'
}

@Entity()
export class BoardRole {
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
