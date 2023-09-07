import { Module } from "@nestjs/common";
import { OrderServices } from "./order-service";
import { OrderController } from "./order-controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "../Entities/menu.entity";
import { Order } from "../Entities/orders.entity";
import { MenuItems } from "../Entities/menuitem.entity";
import { OrderItem } from "../Entities/orderitem.entity";
import { Employee } from "../Entities/employee.entity";
import { Roles } from "../Entities/roles.entities";
import { EmployeeAuthGuard } from "../Auth/Auth.guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RolesGuard } from "../guards/rolebased.guard";

@Module({

controllers : [OrderController],
imports: [TypeOrmModule.forFeature([Menu,Order,MenuItems,OrderItem, Employee, Roles]),JwtModule.register({
    secret: 'employeesecret',
    signOptions : {algorithm : 'HS512',
    expiresIn : '1d'
                }
}),PassportModule.register({defaultStrategy : 'jwt'})],
providers : [OrderServices,EmployeeAuthGuard,RolesGuard],

})
export class Ordermodule {}