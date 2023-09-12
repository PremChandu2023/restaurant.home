import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createRestaurantDto } from './Dtos/resaturant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
@ApiTags('restaurant')
export class RestaurantController {
    constructor(private restaurantService:RestaurantService)
    {

    }

   
    @Post()
    createRestaurant(@Body() createRestaurantDto:createRestaurantDto)
    {
        this.restaurantService.createRestaurant();
    }


}
