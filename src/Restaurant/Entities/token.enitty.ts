import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity('jwttoken')
export class Token {
    @PrimaryGeneratedColumn()
    id:number

    @Column({length: 512})
    token_value:string

    @Column()
    expirationTimestamp:Date;
    @CreateDateColumn({type:'timestamp'})
    createdAt:Date

    @ManyToOne(() => Employee, (employees) => employees.tokens)
    user:Employee
}