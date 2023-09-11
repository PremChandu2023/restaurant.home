import { Body, Controller, Get, Param, Post, Res, UseGuards, UseInterceptors, Put, Request, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from 'express'
import { max } from "class-validator";
import { GlobalResponseInterceptor } from "../Interceptors/menu.interceptor";
import { EmployeeAuthGuard } from "../guards/Auth.guards/auth.guard";

import { ApiTags } from "@nestjs/swagger";
import { AuthCustomdecarators } from "./Swagger/auth-swaggerdecaratot";
import { AuthGuard } from "@nestjs/passport";
import { PassportAuthGuard } from "../guards/Auth.guards/passport.authguard";
import { JwtAuthGuard } from "../guards/Auth.guards/jwt.authguard";
import { MenuExceptionConstants } from "../Menu/Constants/exception.constants";
import { UserAuthConstants } from "./Constants/auth.exception.constants";
import { loginEmployeeDto, registerEmployeeDto, createRoleDto, updateRoleDto } from "./Dtos/auth.dtos";

@ApiTags("UserAuth")
@Controller('/user')
@UseInterceptors(GlobalResponseInterceptor)
export class AuthController {
    logger:Logger
    constructor(private authservice: AuthService) { 
        this.logger = new Logger(AuthController.name)
    }

    /*Authentication means checking the identity of user. It provides an answer to a question: who is the user?
    Authorization is about access to resources. It answers the question: is user authorized to perform this operation?*/
    @AuthCustomdecarators('Post', 'login')
    @Post('login')
    async employeeLogin(@Body() loginBody: loginEmployeeDto, @Res() response: Response) {
        const tokens = await this.authservice.checkLogin(loginBody);
        this.logger.log('tokens are generated successfully')
        // response.cookie('Authentication',token,{httpOnly:true, maxAge: 2*60*60*100})
        // return response.send({
        //     success: true,
        //     employee
        // })
        response.status(201).json({
            succes: true,
            JwtToken: tokens.JwtAccessToken,
            JwtRefereshToken: tokens.JwtrefereshToken

        })
    }
    @AuthCustomdecarators('Post', 'refereshtoken')
    @Post('refereshtoken')
    async refreshToken(@Body('refereshtoken') refereshToken: string) {
        try {
            const newAccessToken = await this.authservice.validateRefereshToken(refereshToken);
            this.logger.log('Jwt token has been generated')
            return { JwtToken: newAccessToken };
        }
        catch (error) {
            switch (error.name) {
                case "TokenExpiredError":
                    throw new BadRequestException(error);
                case "JsonWebTokenError":
                    throw new BadRequestException(error)
                case UserAuthConstants.REFRESHTOKEN_NOTFOUND:
                    throw new BadRequestException(error)
                default:
                    throw new InternalServerErrorException({ message: 'An error occurred while processing the request for referesh token' });
            }
        }

    }
    /* registers the new user*/
    @AuthCustomdecarators('Post', 'register')
    @Post('register')
    async employeeRegister(@Body() employee: registerEmployeeDto) {
        try {
            return this.authservice.registerEmployee(employee)

        }
        catch (error) {
            switch (error) {
                case UserAuthConstants.EMAIL_ALREADY_REGISTERED:
                    throw new BadRequestException(error);
                case UserAuthConstants.ROLE_NOT_FOUND:
                    throw new NotFoundException(error);
                default:
                    throw new InternalServerErrorException({ message: "Cannot register the employee" })
            }

        }
    }

    // @UseGuards(EmployeeAuthGuard)
    @AuthCustomdecarators('Get', ':id/details')
    @Get('/:id')
    async getEmployeeDetails(@Param('id') id: number) {
        try {
            return await this.authservice.findEmployeeDetails(id);
        }
        catch (error) {
            switch (error) {    
                case UserAuthConstants.EMPLOYEEID_NOT_FOUND:
                    throw new NotFoundException(error)
                default:
                    throw new InternalServerErrorException(`Cannot get details of employee using employee id ${id}`)
            }
        }
    }

    /* @Roles ==> all the new roles are created*/
    @AuthCustomdecarators("Post", 'roles')
    @Post('roles')
    async createRoles(@Body() roleName: createRoleDto) {
        try {
            return await this.authservice.createRoles(roleName);
        }
        catch (error) {
            switch (error) {
                case UserAuthConstants.ROLE_ALREADY_PRESENT:
                    throw new ConflictException(error);
                default:
                    throw new InternalServerErrorException({ message: 'Cannot create a role' })
            }
        }

    }
    @AuthCustomdecarators("Put", 'role/:id')
    @Put('role/:id')
    async updateRoles(@Body() updateRoles: updateRoleDto, @Param('id') employeeid: number) {
        try {
            return await this.authservice.updateRoles(updateRoles, employeeid);
        }
        catch (error) {
            switch (error) {
                case UserAuthConstants.EMPLOYEEID_NOT_FOUND:
                    throw new NotFoundException(error)
                case UserAuthConstants.ROLE_NOT_FOUND:
                    throw new NotFoundException(error)
            }
        }

    }

}