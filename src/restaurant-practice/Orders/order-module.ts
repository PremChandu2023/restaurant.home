import { Module } from "@nestjs/common";
import { OrderServices } from "./order-service";
import { OrderController } from "./order-controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "../Entities/orders.entities/menu.entity";
import { Order } from "../Entities/orders.entities/orders.entity";
import { MenuItems } from "../Entities/orders.entities/menuitem.entity";
import { OrderItem } from "../Entities/orders.entities/orderitem.entity";
import { Employee } from "../Entities/orders.entities/employee.entity";
import { Roles } from "../Entities/orders.entities/roles.entities";
import { EmployeeAuthGuard } from "../Auth/auth.Guard";
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