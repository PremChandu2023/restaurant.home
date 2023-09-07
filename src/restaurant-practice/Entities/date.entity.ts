import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export class Dateschema {

    @CreateDateColumn()
    createdDate :Date

    @UpdateDateColumn()
    updatedDate : Date

}