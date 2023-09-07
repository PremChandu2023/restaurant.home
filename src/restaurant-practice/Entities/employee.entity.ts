import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./roles.entity";
import { publicEncrypt } from "crypto";
import * as bycrypt from 'bcrypt';
import { Dateschema } from "./date.entity";
import { IsNumberString } from "class-validator";
import { Token } from "./token.enitty";


@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    employee_Id:string

    @Column({nullable:false})
    employee_Name: string

    @Column({default:'inactive'})
    status:string //active or inactive

    @Column({nullable:false})
    email:string

    @Column({nullable:false})
    password:string

    @Column({nullable :true})
    @IsNumberString()
    phoneNumber:string

    @ManyToOne(() => Roles, (roles) => roles.employees, {eager : true})
    roles:Roles

    @Column(() => Dateschema)
    date:Dateschema

    @OneToMany(()=> Token, (tokens) => tokens.user)
    tokens : Token[]

    @BeforeInsert()
    hashPassword() {
        this.password= bycrypt.hashSync(this.password, 10);
    }
}