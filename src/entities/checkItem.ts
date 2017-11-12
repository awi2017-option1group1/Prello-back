import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { CheckList } from './checkList'

@Entity()
export class CheckItem {
// ------------------------------------
// =        ENTITY DEFINITION
// ------------------------------------
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar'
    })
    name: string

    @Column({
        type: 'int'
    })
    pos: number

    @Column({
        type: 'boolean'
    })
    state: boolean

// ------------------------------------
//            EXTERNAL LINKS
// ------------------------------------
    @ManyToOne(type => CheckList, checkList => checkList.checkItems)
    checkList: CheckList
 }
