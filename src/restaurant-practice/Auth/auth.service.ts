import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
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
import { Token } from "../Entities/orders.entities/token.enitty";
import { JwtPayloadDto } from "../dtos/jwtpayload.dto";
import { GetLoginDto } from "../dtos/login.getDto";
import { UserAuthConstants } from "./constants/auth.exception.constants";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(@InjectRepository(Employee) private employeeRespository:Repository<Employee>,@InjectRepository(Roles) private rolesRespository:Repository<Roles>,@InjectRepository(Token) private tokenRepository:Repository<Token>,
    private configService:ConfigService,private jwtService:JwtService){}
    async checkLogin(createLogin: loginEmployeeDto)
    {  
        try{
        const employee = await this.employeeRespository.findOne({ where : {email : createLogin.email},relations: {tokens : false}})
        if(!employee)
        {
            throw  UserAuthConstants.BAD_CREDENTIALS;
        }
        else{
            //verify hashed request and password in database
          if(await  this.verifyPassword(createLogin.password, employee.password)) 
          {
            
            // access jwt token generation with employee list as a payload 

               const accesstoken = await this.generateJwtAccessToken(employee.id);
               //generates the refersh token with employee list as a payload
               const refereshtoken = await this.generateRefreshToken(employee);
                const tokens : GetLoginDto ={ JwtAccessToken:accesstoken,
                JwtrefereshToken:refereshtoken}

                return tokens ;
          }
          else{
            throw UserAuthConstants.BAD_CREDENTIALS;
          }
        }
    }
        catch(error)
        {
            switch(error)
            {
                case UserAuthConstants.BAD_CREDENTIALS:
                    throw new BadRequestException(error);
            }
        }      
    }
    async generateJwtAccessToken(employee_id:number)
    {
        const payload : JwtPayloadDto = {userId: employee_id}
        const secretkey = this.configService.get<string>("JWT_SECRET_KEY");
        const token = await this.jwtService.signAsync(payload, {secret: secretkey,expiresIn : '1d'});
        return token;
    }
    async generateRefreshToken(employee:Employee)
    {
        
        const payload :JwtPayloadDto = {userId: employee.id}
        const token = await this.jwtService.signAsync(payload, {expiresIn:'7d',secret:'employesecret'}) // 7 * 24 * 60 * 60 * 1000 calculates the total number of milliseconds in 7 days.

        /*create an instance of token and with expireddate calculation and stores in the database*/            
        const newToken = this.tokenRepository.create({expirationTimestamp : new Date(new Date().getTime()+ 7 * 24 * 60 * 60 * 1000),token_value: token})
        newToken.user= employee;
        await this.tokenRepository.save(newToken);
        return token;
    }
   async validateRefereshToken(refereshToken:string)
   {    
        const token = await this.jwtService.verifyAsync(refereshToken, {secret:'employesecret'})
        
        const referenceToken = await this.tokenRepository.findOne({where :{token_value: refereshToken}})
        if(!referenceToken)
        {
            throw UserAuthConstants.REFRESHTOKEN_NOTFOUND;
        }
        if(referenceToken.expirationTimestamp < new Date())
        {
            throw UserAuthConstants.REFRESHTOKEN_EXPIRED;
        }
       return  await this.generateJwtAccessToken(token.userId)
   }
    async registerEmployee(employee:registerEmployeeDto)
    {
        const newEmployee = await this.employeeRespository.findOne({where : {email : employee.email}})
        if(newEmployee)
        {
            throw UserAuthConstants.EMAIL_ALREADY_REGISTERED
        }
        else
        {
            const newEmployee = new Employee();
        // console.log(newEmployee);
        // console.log(employee);
        Object.assign(newEmployee,employee);
        const Role = await this.rolesRespository.findOne({where : {name : employee.role}}) 
        if(!Role)
        {
            throw UserAuthConstants.ROLE_NOT_FOUND
        }
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
        const result = await this.employeeRespository.findOne({where : {
            id : id
        }, select :['id', 'employee_Id', 'employee_Name', 'status', 'email', 'phoneNumber']})
        if(!result)
        {
            throw UserAuthConstants.EMPLOYEEID_NOT_FOUND;
        }
        return result ; 
    }
    async createRoles(roleName:createRoleDto)
    {
        const newRoles = await this.rolesRespository.findOne({where : {name: roleName.roleName}});
        if(newRoles)
        {
            throw UserAuthConstants.ROLE_ALREADY_PRESENT;
        }
        const newRole = this.rolesRespository.create({name : roleName.roleName, description : roleName.description});
        return await this.rolesRespository.save(newRole)
    }
    async updateRoles(updateRole:updateRoleDto, employeid:number)
    {
        
        const newEmployee = await this.employeeRespository.findOne({where : {id:employeid}})
        if(!newEmployee)
        {
            throw UserAuthConstants.EMPLOYEEID_NOT_FOUND;
        }
        
        const Role = await this.rolesRespository.findOne({where : {name : updateRole.name}})

        if(!Role)
        {
            throw UserAuthConstants.ROLE_NOT_FOUND;
        }

        newEmployee.roles=Role;
        return await this.employeeRespository.save(newEmployee)
    }

}