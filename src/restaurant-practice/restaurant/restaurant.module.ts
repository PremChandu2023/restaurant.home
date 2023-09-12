import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './Entities/restaurant.entity';

@Module({
  controllers: [RestaurantController],
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantService]
})
export class RestaurantModule {}
