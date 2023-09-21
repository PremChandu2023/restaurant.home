import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import {Request} from 'express';
import { ROLES_KEY, Roles } from "../../Auth/Customdecarators/customroles.decarator";
import { Role } from "../../Enums/roles.enums";
import { Employee } from "../../Entities/employee.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RolesGuard  implements CanActivate{
    constructor(private jwtService : JwtService,
      @InjectRepository(Employee)private employeeRepository :Repository<Employee>,
      private reflector:Reflector) {}
   async  canActivate(context : ExecutionContext)
    {   
      const requiredRoles=  this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[context.getHandler(),
        context.getClass()]);
        if(!requiredRoles)
        {
            return true;
        }
        const request = context.switchToHttp().getRequest<Request>()
        const  token = this.getTokenFromHeader(request);
        
        const employee = await this.jwtService.verifyAsync(token , {secret : process.env['JWT_SECRET_KEY']});



        const newEmployee = await this.employeeRepository.findOne({where : {id : employee.userId}}) 

       const value = requiredRoles.some((roles) => newEmployee?.roles?.name === roles)
       if(!value)
       {
          throw new HttpException({message : 'Error_User_with_this_role_is_not_permitted_to_access_the_resource'}, HttpStatus.FORBIDDEN);
       }     
       return value;
    }

   getTokenFromHeader(request:Request)
   {
        const [type , token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
   }

}