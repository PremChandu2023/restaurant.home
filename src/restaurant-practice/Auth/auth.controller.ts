import { Body, Controller, Get, Param, Post, Res, UseGuards, UseInterceptors, Put, Request, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginEmployeeDto } from "../dtos/login.employeeDto";
import { Response } from 'express'
import { max } from "class-validator";
import { registerEmployeeDto } from "../dtos/register.employeeDto";
import { RecentsearchInterceptor } from "../interceptors/interceptor-menu";
import { EmployeeAuthGuard } from "./auth.Guard";
import { createRoleDto } from "../dtos/createRole.dtos";
import { updateRoleDto } from "../dtos/updateRole.dtos";
import { ApiTags } from "@nestjs/swagger";
import { AuthCustomdecarators } from "./swagger-Auth/auth-swaggerdecaratot";
import { AuthGuard } from "@nestjs/passport";
import { PassportAuthGuard } from "./guards/passport.authguard";
import { JwtAuthGuard } from "./guards/jwt.authguard";
import { MenuExceptionConstants } from "../Menu/constants/exception.constants";
import { UserAuthConstants } from "./constants/auth.exception.constants";

@ApiTags("UserAuth")
@Controller('/user')
@UseInterceptors(RecentsearchInterceptor)
export class AuthController {
    constructor(private authservice: AuthService) { }

    /*Authentication means checking the identity of user. It provides an answer to a question: who is the user?
    Authorization is about access to resources. It answers the question: is user authorized to perform this operation?*/
    @AuthCustomdecarators('Post', 'login')
    @Post('login')
    async employeeLogin(@Body() loginBody: loginEmployeeDto, @Res() response: Response) {
        const tokens = await this.authservice.checkLogin(loginBody);

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
                    throw new InternalServerErrorException({ message: 'An error occurred while processing the request' });
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
                    throw new InternalServerErrorException("Cannot get details of employee using employee id")
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