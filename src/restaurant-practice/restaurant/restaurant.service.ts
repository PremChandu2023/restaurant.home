import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './Entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private restaurantRespository:Repository<Restaurant>){}

    createRestaurant()
    {
        
    }
}
