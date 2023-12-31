import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from "../guards/Auth-guard";
import { GlobalResponseInterceptor } from '../Interceptors/menu.interceptor';
import { CustomBook } from '../Auth/Customdecarators/custom-decarrators-Books';
import { MenuDto, MenuItemDto } from '../Orders/orders.dtos';
import { MenuService } from './menu.service';
import { Request } from 'express';
import { EmployeeAuthGuard } from '../guards/Auth.guards/auth.guard';
import { RolesGuard } from '../guards/Auth.guards/rolebased.guard';
import { Role } from '../Enums/roles.enums';
import { Roles } from '../Auth/Customdecarators/customroles.decarator';
import { MenuCustomdecarators } from './Swagger/swagger.menu.decarator';
import { MenuExceptionConstants } from './Constants/exception.constants';
import { Cron } from '@nestjs/schedule';
import { OrderType } from './Constants/orders.type';
import { MenuItemStatus } from './Enums/menuItem.status';
import { UpdateStatusDto } from './Dtos/updateStatusDtos';

@ApiTags('Menu')
@Controller('menu')
@Roles(Role.Manager)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class Menucontroller {
  logger: Logger;
  constructor(private menuService: MenuService) {
    this.logger = new Logger(Menucontroller.name);
  }

  /**
   * Obtain the menuitem using given menuitemid*/
  @Roles(Role.Waiter)
  @MenuCustomdecarators('Get', '/:id')
  @Get('menu-item/:id')
  async getMenuItemsById(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id);
    
    return await this.menuService.getMenuItemById(id);
  }

  @Get()
  @MenuCustomdecarators('Get', '/')
  getAllMenuItems() {
    return this.menuService.getAllItems();
    // return this.menuService.updateStatus();
  }

  /**
   * Sorting the menuitems using item name or category*/
  @Get('/search')
  @MenuCustomdecarators('Get', '/search')
  async searchMenuItems(
    @Query('itemName') ItemName: string,
    @Query('category') category: string,
  ) {
       return await this.menuService.searchMenuItems(ItemName,category);
  }

  @Get('/filter')
  @MenuCustomdecarators('Get', '/filter')
  async getMenuItemsByFilter(
    @Query('price-Min') priceMin: number,
    @Query('price-Max' ) priceMax: number,
    @Query('status') status: string,
    @Query('filter') filter:string
  ) {
    try {
      if (status  || priceMin || priceMax || filter) {
        return await this.menuService.getMenuItemByFilter(
          status,
          priceMax,
          priceMin,
          filter
        );
      } else {
        // Handle the case where neither itemName nor category is provided
        throw new BadRequestException({
          message:
            'Please provide either itemName or category or price in the query.',
        });
      }
    } catch (error) {
      switch (error) {
        case MenuExceptionConstants.CATEGORY_NOT_FOUND:
          throw new NotFoundException(error);
        case MenuExceptionConstants.MENUITEMNAME_NOTFOUND:
          throw new NotFoundException(error);
        default:
          throw new InternalServerErrorException(error);
      }
    }
  }

  /*
   * This creates the new menu category*/
  @MenuCustomdecarators('Post', '/')
  @Post()
  async createMenu(@Body() menu: MenuDto) {
    try {
      return await this.menuService.createMenu(menu);
    } catch (error) {
      switch (error) {
        case MenuExceptionConstants.MENUID_NOTFOUND:
          throw new NotFoundException(error);
        default:
          throw new InternalServerErrorException({
            message: 'Cannot create a new Menu',
          });
      }
    }
  }

  @Roles(Role.Waiter)
  @MenuCustomdecarators('Post', ':id/menuitem')
  @Post(':id/menu-item')
  async addMenuItem(
    @Body() menuItem: MenuItemDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await this.menuService.addMenuItem(menuItem, id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Put('/:id/menuitem-status')
  @MenuCustomdecarators('Put', '/:id/menuitem-status')
  async updateMenuStatus(
    @Body() status: UpdateStatusDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.menuService.updateAvailableStatus(status, id);
  }
}
