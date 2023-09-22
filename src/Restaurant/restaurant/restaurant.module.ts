import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './Entities/restaurant.entity';
import { Menumodule } from '../Menu/menu.module';
import { MenuItems } from '../Entities/menuitem.entity';
import { Roles } from '../Entities/roles.entity';
import { Employee } from '../Entities/employee.entity';
import { User } from '../Entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Rating } from '../Entities/ratings.entity';
import { OrderItem } from '../Entities/orderitem.entity';

@Module({
  controllers: [RestaurantController],
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuItems, Roles, Employee, User, Rating, OrderItem]),
    Menumodule,
  ],
  providers: [RestaurantService],
})
export class RestaurantModule {}
