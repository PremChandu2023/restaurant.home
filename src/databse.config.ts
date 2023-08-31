import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Menu } from "./restaurant-practice/Entities/orders.entities/menu.entity";
import { MenuItems } from "./restaurant-practice/Entities/orders.entities/menuitem.entity";
import { Order } from "./restaurant-practice/Entities/orders.entities/orders.entity";
import { Employee } from "./restaurant-practice/Entities/orders.entities/employee.entity";
import { Roles } from "./restaurant-practice/Entities/orders.entities/roles.entities";
import { OrderItem } from "./restaurant-practice/Entities/orders.entities/orderitem.entity";
import { Token } from "./restaurant-practice/Entities/orders.entities/token.enitty";

export const restaurentdatabase : TypeOrmModuleOptions  = 
 {
        type : 'mysql',
        host : 'localhost',
        port : 3306,
        username: 'root',
        password : 'root123',
        database:'restaurant',
        entities: [Menu, MenuItems, Order,OrderItem, Employee, Roles, Token],
        synchronize: true,
        // logging : true

}

export const restaurentdatabass : TypeOrmModuleOptions  = 
 {
        type : 'mysql',
        host : 'localhost',
        port : 3306,
        username: 'root',
        password : 'root123',
        database:'restaurent',
        entities: [__dirname + "/../../entity/*{.js,.ts}"],
        synchronize: true,
        // logging : true

}

