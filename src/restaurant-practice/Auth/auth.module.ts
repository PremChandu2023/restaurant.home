import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "../Entities/orders.entities/employee.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { EmployeeAuthGuard } from "./auth.Guard";
import { Roles } from "../Entities/orders.entities/roles.entities";
import { RolesGuard } from "../guards/rolebased.guard";
import { LocalStrategy } from "./strategies/local.strategy";
import { Token } from "../Entities/orders.entities/token.enitty";


@Module({
controllers: [AuthController],
imports : [TypeOrmModule.forFeature([Employee, Roles,Token]),
            JwtModule.register({
                secret: 'employeesecret',
                signOptions : {algorithm : 'HS512',
                            }
            }),PassportModule.register({defaultStrategy : 'jwt'})],providers : [AuthService,EmployeeAuthGuard,RolesGuard]
})
export class AuthModule {

}