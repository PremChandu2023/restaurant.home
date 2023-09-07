import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Menu } from "../restaurant-practice/Entities/menu.entity";
import { MenuItems } from "../restaurant-practice/Entities/menuitem.entity";
import { Order } from "../restaurant-practice/Entities/orders.entity";
import { Employee } from "../restaurant-practice/Entities/employee.entity";
import { Roles } from "../restaurant-practice/Entities/roles.entity";
import { OrderItem } from "../restaurant-practice/Entities/orderitem.entity";
import { Token } from "../restaurant-practice/Entities/token.enitty";

export const restaurentdatabase : TypeOrmModuleOptions  = 
 {
        type : 'mysql',
        host : process.env['DB_HOST'],
        port :Number( process.env['DB_PORT']),
        username: 'root',
        password : 'root123',
        database:'restaurant',
        autoLoadEntities: true,
        synchronize: true,
        logging : true,
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

