import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "../Entities/employee.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { EmployeeAuthGuard } from "./Auth.guards/auth.guard";
import { Roles } from "../Entities/roles.entities";
import { RolesGuard } from "../guards/rolebased.guard";
import { LocalStrategy } from "./strategies/local.strategy";
import { Token } from "../Entities/token.enitty";
import { ConfigModule } from "@nestjs/config";


@Module({
controllers: [AuthController],
imports : [TypeOrmModule.forFeature([Employee, Roles,Token]),
            JwtModule.register({
                secret: 'employeesecret',
                signOptions : {algorithm : 'HS512',
                            }
            }),ConfigModule],providers : [AuthService,EmployeeAuthGuard,RolesGuard]
})
export class AuthModule {

}