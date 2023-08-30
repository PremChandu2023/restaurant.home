import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "../Entities/orders.entities/employee.entity";
import { Repository } from "typeorm";
import { loginEmployeeDto } from "../dtos/login.employeeDto";
import * as bycrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { registerEmployeeDto } from "../dtos/register.employeeDto";
import { createRoleDto } from "../dtos/createRole.dtos";
import { Roles } from "../Entities/orders.entities/roles.entities";
import { updateRoleDto } from "../dtos/updateRole.dtos";

@Injectable()
export class AuthService {

    constructor(@InjectRepository(Employee) private employeeRespository:Repository<Employee>,@InjectRepository(Roles) private rolesRespository:Repository<Roles>,
                private jwtService:JwtService){}
    async checkLogin(createLogin: loginEmployeeDto)
    {
        
        const employee = await this.employeeRespository.findOne({ where : {email : createLogin.email}})
        if(!employee)
        {
            throw new UnauthorizedException({message:'Bad_credentials'})
        }
        else{
            //verify hashed request and password in database
          if(await  this.verifyPassword(createLogin.password, employee.password)) 
          {
            //payload is employee list object
                const token =await this.jwtService.signAsync({employee})
                delete employee.password;
                return {token, employee}
          }
          else{
            throw new UnauthorizedException({message :'Bad credentials'});
          }
        }      
    }
    async registerEmployee(employee:registerEmployeeDto)
    {
        
        // const newEmployee = new Employee();
        // console.log(newEmployee);
        // console.log(employee);
        // Object.assign(newEmployee,employee);
        const newEmployee = await this.employeeRespository.findOne({where : {email : employee.email}})
        if(newEmployee)
        {
            throw new BadRequestException('Given email is already registered give new email')
        }
        else
        {
            const newEmployee = new Employee();
        // console.log(newEmployee);
        // console.log(employee);
        Object.assign(newEmployee,employee);
        const Role = await this.rolesRespository.findOne({where : {name : employee.role}}) 
        newEmployee.roles=Role;
            // console.log(newEmployee);
        await this.employeeRespository.save(newEmployee)
        delete newEmployee.password;
        return newEmployee;
        }
       
    }
   async verifyPassword(password:string, hash:string)
    {
        return await bycrypt.compare(password,hash)
    }

    async findEmployeeDetails(id:number)
    {
        return await this.employeeRespository.findOne({where : {
            id : id
        }, select :['id', 'employee_Id', 'employee_Name', 'status', 'email', 'phoneNumber']})
    }
    async createRoles(roleName:createRoleDto)
    {
        const newRoles = await this.rolesRespository.findOne({where : {name: roleName.roleName}});
        if(newRoles)
        {
            throw new BadRequestException({error: "Conflict Error", message : 'Given_role_is_already_present '});
        }
        const newRole = this.rolesRespository.create({name : roleName.roleName, description : roleName.description});
        return await this.rolesRespository.save(newRole)
    }
    async updateRoles(updateRole:updateRoleDto, employeid:number)
    {
        
        const newEmployee = await this.employeeRespository.findOne({where : {id:employeid}})
        
        const Role = await this.rolesRespository.findOne({where : {name : updateRole.name}})

        newEmployee.roles=Role;
        return await this.employeeRespository.save(newEmployee)
    }

}