import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddMenuItemDto, createRestaurantDto } from './Dtos/resaturant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
@ApiTags('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) { }

  @Post('/')
  async createRestaurant(@Body() createRestaurantDto: createRestaurantDto) {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
    } catch (error) {
      throw new BadRequestException({ message: error });
    }
  }
  @Put('/:id/menu-item')
  async addMenuitems(
    @Param('id', ParseIntPipe) restaurantId: number,
    @Body() addMenuItemDto: AddMenuItemDto,
  ) {
    try {
      return await this.restaurantService.addMenuItems(
        addMenuItemDto,
        restaurantId,
      );
    } catch (error) {
      throw new BadRequestException({ message: error });
    }
  }
  @Get('/filter')
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'price', required: false })
  async getAllRestaurentDetails(
    @Query('price') price: number,
    @Query('restaurantId') id: number,
  ) {
    // return await this.restaurantService.getAllRestaurantDetails(id, price);
    return await this.restaurantService.getRestaurantDetailsWithOrders(id);
  }

  @Get('/role/:id')
  getEmployeesById(@Param('id', ParseIntPipe) id:number)
  {
     return this.restaurantService.getEmployeeByRoleId(id);
  }

  @Get('/orderscount')
  async getOrdersCount()
  {
      return await this.restaurantService.getTotalOrdersCount();
  }
}
