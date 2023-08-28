import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Employee } from "src/restaurant-practice/Entities/employee.entity";
import { Exclude } from "class-transformer";
import { Dateschema } from "../Orders/orders.entities/date.entity";

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable:true})
    description:string

    @OneToMany(() => Employee, (employees) => employees.roles)
    employees: Employee[]

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema
}