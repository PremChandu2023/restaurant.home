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

@Module({
  controllers: [RestaurantController],
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuItems, Roles, Employee, User]),
    Menumodule,
  ],
  providers: [RestaurantService],
})
export class RestaurantModule {}
