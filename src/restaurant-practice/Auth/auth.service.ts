import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import * as bycrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";

import { UserAuthConstants } from "./Constants/auth.exception.constants";
import { ConfigService } from "@nestjs/config";
import { Employee } from "../Entities/employee.entity";
import { Roles } from "../Entities/roles.entity";
import { Token } from "../Entities/token.enitty";
import { GetLoginDto, JwtPayloadDto, createRoleDto, loginEmployeeDto, registerEmployeeDto, updateRoleDto } from "./Dtos/auth.dtos";



@Injectable()
export class AuthService {
    logger:Logger

    constructor(@InjectRepository(Employee) private employeeRespository:Repository<Employee>,@InjectRepository(Roles) private rolesRespository:Repository<Roles>,@InjectRepository(Token) private tokenRepository:Repository<Token>,
    private configService:ConfigService,private jwtService:JwtService){
        this.logger = new Logger(AuthService.name)
    }
    async checkLogin(createLogin: loginEmployeeDto)
    {  
        try{
            this.logger.log('initializes the process of login','AuthService')
        const employee = await this.employeeRespository.findOne({ where : {email : createLogin.email},relations: {tokens : false}})
        if(!employee)
        {
            this.logger.error(UserAuthConstants.BAD_CREDENTIALS)
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
            this.logger.error(UserAuthConstants.BAD_CREDENTIALS)
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
        this.logger.log('Generation of jwt token')
        const payload : JwtPayloadDto = {userId: employee_id}
       
        
    const token = await this.jwtService.signAsync(payload, {secret:  process.env['JWT_SECRET_KEY'],expiresIn: 1});
        
        return token;
    }
    async generateRefreshToken(employee:Employee)
    {
        this.logger.log('Genration of refresh token')
        const payload :JwtPayloadDto = {userId: employee.id}
        const secretkey = this.configService.get<string>("JWT_REFERSH_KEY");

        const token = await this.jwtService.signAsync(payload, {expiresIn:'7d',secret: secretkey}) // 7 * 24 * 60 * 60 * 1000 calculates the total number of milliseconds in 7 days.

        /*create an instance of token and with expireddate calculation and stores in the database*/            
        const newToken = this.tokenRepository.create({expirationTimestamp : new Date(new Date().getTime()+ 7 * 24 * 60 * 60 * 1000),token_value: token})
        newToken.user= employee;
        await this.tokenRepository.save(newToken);
        return token;
    }
   async validateRefereshToken(refereshToken:string)
   { 
        this.logger.log('validation of referesh tokens has initialized')   
        const token = await this.jwtService.verifyAsync(refereshToken, {secret:'employeekey'})
        
        const referenceToken = await this.tokenRepository.findOne({where :{token_value: refereshToken}})
        if(!referenceToken)
        {
            this.logger.error(UserAuthConstants.REFRESHTOKEN_NOTFOUND)
            throw UserAuthConstants.REFRESHTOKEN_NOTFOUND;
        }
        if(referenceToken.expirationTimestamp < new Date())
        {
            this.logger.error(UserAuthConstants.REFRESHTOKEN_EXPIRED)
            throw UserAuthConstants.REFRESHTOKEN_EXPIRED;
        }
       return  await this.generateJwtAccessToken(token.userId)
   }
    async registerEmployee(employee:registerEmployeeDto)
    {
        this.logger.log('intializing the registration of employee process')
        const newEmployee = await this.employeeRespository.findOne({where : {email : employee.email}})
        if(newEmployee)
        {
            this.logger.error(UserAuthConstants.EMAIL_ALREADY_REGISTERED)
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
            this.logger.error(UserAuthConstants.ROLE_NOT_FOUND)
            throw UserAuthConstants.ROLE_NOT_FOUND
        }
        newEmployee.roles=Role;
            // console.log(newEmployee);
        await this.employeeRespository.save(newEmployee)
        delete newEmployee.password;
        this.logger.log('completed the process of employee registration')
        return newEmployee;
        }
       
    }
   async verifyPassword(password:string, hash:string)
    {
        return await bycrypt.compare(password,hash)
    }

    async findEmployeeDetails(id:number)
    {
        this.logger.log(`Fetching employee details for ID: ${id}`)
        const result = await this.employeeRespository.findOne({where : {
            id : id
        }, select :['id', 'employee_Id', 'employee_Name', 'status', 'email', 'phoneNumber']})
        if(!result)
        {
            this.logger.error(UserAuthConstants.EMPLOYEEID_NOT_FOUND)
            throw UserAuthConstants.EMPLOYEEID_NOT_FOUND;
        }
        this.logger.log(`Completed the process of Fetching employee details for ID: ${id}`)
        return result ; 
    }
    async createRoles(roleName:createRoleDto)
    {
        this.logger.log('Initializes the process of creating new role');
        const newRoles = await this.rolesRespository.findOne({where : {name: roleName.roleName}});
        if(newRoles)
        {
            this.logger.error(UserAuthConstants.ROLE_ALREADY_PRESENT)
            throw UserAuthConstants.ROLE_ALREADY_PRESENT;
        }
        const newRole = this.rolesRespository.create({name : roleName.roleName, description : roleName.description});
        this.logger.log(`Completed the process of creating  a new role`);
        return await this.rolesRespository.save(newRole)
    }
    async updateRoles(updateRole:updateRoleDto, employeid:number)
    {
        this.logger.log(`Updating the roles of employeeid1${employeid}`);
        const newEmployee = await this.employeeRespository.findOne({where : {id:employeid}})
        if(!newEmployee)
        {
            this.logger.error(UserAuthConstants.EMPLOYEEID_NOT_FOUND)
            throw UserAuthConstants.EMPLOYEEID_NOT_FOUND;
        }
        
        const Role = await this.rolesRespository.findOne({where : {name : updateRole.name}})

        if(!Role)
        {
            this.logger.error(UserAuthConstants.ROLE_NOT_FOUND)
            throw UserAuthConstants.ROLE_NOT_FOUND;
        }

        newEmployee.roles=Role;
        this.logger.log(`Procees of updating the roles of employeeid1${employeid} has been completed`);
        return await this.employeeRespository.save(newEmployee)
    }
}