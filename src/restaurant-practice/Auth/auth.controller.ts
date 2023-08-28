import { Body, Controller, Get, Param, Post, Res, UseGuards, UseInterceptors, Put} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginEmployeeDto } from "../dtos/login.employeeDto";
import {Response} from 'express'
import { max } from "class-validator";
import { registerEmployeeDto } from "../dtos/register.employeeDto";
import { RecentsearchInterceptor } from "../interceptors/interceptor-menu";
import { EmployeeAuthGuard } from "./auth.Guard";
import { createRoleDto } from "../dtos/createRole.dtos";
import { updateRoleDto } from "../dtos/updateRole.dtos";
import { ApiTags } from "@nestjs/swagger";
import { AuthCustomdecarators } from "./swagger-Auth/auth-swaggerdecaratot";

@ApiTags("EmployeeAuth")
@Controller('/employee')
@UseInterceptors(RecentsearchInterceptor)
export class AuthController  {
    constructor(private authservice:AuthService){}

    @AuthCustomdecarators('Post','login')
   @Post('login')
   async employeeLogin(@Body() loginBody: loginEmployeeDto, @Res() response:Response)
    {
       const {token, employee} = await this.authservice.checkLogin(loginBody);

        // response.cookie('Authentication',token,{httpOnly:true, maxAge: 2*60*60*100})
        // return response.send({
        //     success: true,
        //     employee
        // })
        response.status(200).json({
            succes : true,
            jwtToken : token
        })
    }
    @AuthCustomdecarators('Post','register')
    @Post('register')
    async employeeRegister(@Body() employee:registerEmployeeDto)
    {
        return this.authservice.registerEmployee(employee)
    }

    @UseGuards(EmployeeAuthGuard)
    @AuthCustomdecarators('Get',':id/details')
    @Get(':id/details')
    getEmployeeDetails(@Param('id') id:number)
    {
        return this.authservice.findEmployeeDetails(id)
    }

    //roles
    @AuthCustomdecarators("Post",'roles')
    @Post('roles')
    createRoles(@Body() roleName : createRoleDto)
    {
       return this.authservice.createRoles(roleName);
    }
    @AuthCustomdecarators("Put",'role/:id')
    @Put('role/:id')
    updateRoles(@Body() updateRoles:updateRoleDto, @Param('id') employeeid:number)
    {
       return this.authservice.updateRoles(updateRoles,employeeid);
    }

}