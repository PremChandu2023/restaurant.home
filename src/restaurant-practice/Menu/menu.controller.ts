import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
// import { AuthGuard } from "../guards/Auth-guard";
import { GlobalResponseInterceptor } from "../Interceptors/menu.interceptor";
import { CustomBook } from "../Auth/Customdecarators/custom-decarrators-Books";
import { MenuDto, MenuItemDto } from "../Orders/orders.dtos";
import { MenuService } from "./menu.service";
import { Request } from "express";
import { EmployeeAuthGuard } from "../guards/Auth.guards/auth.guard";
import { RolesGuard } from "../guards/Auth.guards/rolebased.guard";
import { Role } from "../Enums/roles.enums";
import { Roles } from "../Auth/Customdecarators/customroles.decarator";
import { MenuCustomdecarators } from "./Swagger/swagger.menu.decarator";
import { MenuExceptionConstants } from "./Constants/exception.constants";
import { Cron } from "@nestjs/schedule";
import { OrderType } from "./Constants/orders.type";


@ApiTags("Menu")
@Controller('menu')
@UseInterceptors(GlobalResponseInterceptor)
@Roles(Role.Manager)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class Menucontroller {
   logger : Logger;
   constructor(private menuService: MenuService) {
      this.logger = new Logger(Menucontroller.name)
    }


   /**
    * Obtain the menuitem using given menuitemid*/
   @Roles(Role.Waiter)
   @MenuCustomdecarators('Get', '/:id')
   @Get('menu-item/:id')
   async getMenuItemsById(@Param('id') id: number) {
      return await this.menuService.getMenuItemById(id);
   }

   @Get()
   @MenuCustomdecarators('Get', '/')
   getAllMenuItems() {      
      return this.menuService.getAllItems();
      // return this.menuService.updateStatus();
      // return this.menuService.filterByPrice(10);
   }


   /**
    * Sorting the menuitems using item name or category*/
   @Get('/filter')
   @MenuCustomdecarators('Get', '/filter')
   @ApiQuery({name: 'itemName', required : false})
   @ApiQuery({name: 'category', required : false})
   async getMenuByName(@Query('itemName',) ItemName: string, @Query('category') category: string) {
      try {
         if (ItemName || category) {
            
            return await this.menuService.getMenuItemsByCategoryOrItemName(category,ItemName);
         }
         else {
            // Handle the case where neither itemName nor category is provided
            throw new BadRequestException({message: 'Please provide either itemName or category in the query.',})
         }
      }
      catch (error) {
         switch (error) {
            case MenuExceptionConstants.CATEGORY_NOT_FOUND:
               throw new NotFoundException(error);
            case MenuExceptionConstants.MENUITEMNAME_NOTFOUND:
               throw new NotFoundException(error);
            default:
               throw new InternalServerErrorException("Cannot_get_the_values_with_given_details");
         }
      }
   }

   /**
    * This creates the new menu category*/
   @MenuCustomdecarators('Post', '/')
   @Post()
  async  createMenu(@Body() menu: MenuDto) {
      try {
         return await this.menuService.createMenu(menu);
      } catch (error) {
         switch (error) {
            case MenuExceptionConstants.MENUID_NOTFOUND:
               throw new NotFoundException(error);
            default:
               throw new InternalServerErrorException({ message: 'Cannot create a new Menu' });
         }
      }
   }

   @Roles(Role.Waiter)
   @MenuCustomdecarators('Post', ':id/menuitem')
   @Post(':id/menu-item')
   async addMenuItem(@Body() menuItem: MenuItemDto, @Param('id', ParseIntPipe) id: number) {
      return await this.menuService.addMenuItem(menuItem, id);
   }

   @Get('/filterbyorder/:type')
   @Roles(Role.Waiter)
   async getAllMenu(@Param('type') type:OrderType)
   {
     return await this.menuService.filterByPrice(type);
   }
}