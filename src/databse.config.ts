import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Menu } from "./restaurant-practice/Orders/orders.entities/menu.entity";
import { MenuItems } from "./restaurant-practice/Orders/orders.entities/menuitem.entity";
import { Order } from "./restaurant-practice/Orders/orders.entities/orders.entity";
import { Employee } from "./restaurant-practice/Entities/employee.entity";
import { Roles } from "./restaurant-practice/Entities/roles.entities";
import { OrderItem } from "./restaurant-practice/Orders/orders.entities/orderitem.entity";

export const restaurentdatabase : TypeOrmModuleOptions  = 
 {
        type : 'mysql',
        host : 'localhost',
        port : 3306,
        username: 'root',
        password : 'root123',
        database:'restaurent',
        entities: [Menu, MenuItems, Order,OrderItem, Employee, Roles],
        synchronize: true,
        // logging : true

}