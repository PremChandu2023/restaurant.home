import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Employee } from "src/Restaurant/Entities/employee.entity";
import { Exclude } from "class-transformer";
import { Dateschema } from "./date.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    name: string

    @Column({nullable:true})
    description:string

    @OneToMany(() => Employee, (employees) => employees.roles)
    employees: Employee[]

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema
}