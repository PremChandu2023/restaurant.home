import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "../Entities/employee.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { EmployeeAuthGuard } from "../guards/Auth.guards/auth.guard";
import { Roles } from "../Entities/roles.entity";
import { RolesGuard } from "../guards/Auth.guards/rolebased.guard";
import { LocalStrategy } from "./Strategies/local.strategy";
import { Token } from "../Entities/token.enitty";
import { ConfigModule } from "@nestjs/config";


@Module({
controllers: [AuthController],
imports : [TypeOrmModule.forFeature([Employee, Roles,Token]),
            JwtModule.register({
                secret: 'employeesecretkey',
                signOptions : {algorithm : 'HS512'}
            }),ConfigModule],providers : [AuthService,EmployeeAuthGuard,RolesGuard, Logger]
})
export class AuthModule  implements OnModuleInit{
    onModuleInit() {
        console.log('AuthModule initialized');
    }
    
}