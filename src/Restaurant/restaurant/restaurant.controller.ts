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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddMenuItemDto, createRestaurantDto } from './Dtos/resaturant.dto';
import { RestaurantService } from './restaurant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'winston';
import { diskStorage } from 'multer';
import { RatingDto, createRatingDto } from '../Orders/Dtos/order.dto';

@Controller('restaurant')
@ApiTags('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

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
    // @Query('price') price: number,
    // @Query('restaurantId') id: number,
    // @Body('filter') filter:string
    @Query() query:any
  ) {
    return await this.restaurantService.getAllRestaurantDetails(query);
    // return await this.restaurantService.getRestaurantDetailsWithOrders(id);
  }

  @Get('/role/:id')
  getEmployeesById(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.getEmployeeByRoleId(id);
  }

  @Get('/orderscount')
  async getOrdersCount() {
    return await this.restaurantService.getTotalOrdersCount();
  }

  @Post('/images')
  @UseInterceptors(
    FileInterceptor('file1', {
      storage: diskStorage({
        destination: 'Uploads',
        filename: (req, file1, cb) => {
          const name :string = file1.originalname.split('.')[0];
          const fileExtension = file1.originalname.split('.')[1];
          const newName = name.split(' ').join('_')+'_'+Date.now().toString()+'.'+fileExtension
          cb(null,newName)
        },
      }),
    }),
  )
  async getRestaurantImages(@UploadedFile() file1: Express.Multer.File) {
    console.log(file1);
  }


  @Post('/:id/rating')
  async createRating(@Param('id') restaurantId:number,@Body() createRating:createRatingDto)
  {
     return await this.restaurantService.createRating(createRating,restaurantId);
  }
}
