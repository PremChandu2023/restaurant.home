import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/Auth-guard";
import { RecentsearchInterceptor } from "../interceptors/interceptor-menu";
import { CustomBook } from "../custom-decarators/custom-decarrators-Books";
import { MenuDto, MenuItemDto } from "../Orders/orders.dtos";
import { MenuService } from "./menu-service";
import { Request } from "express";
import { EmployeeAuthGuard } from "../Auth/auth.Guard";
import { RolesGuard } from "../guards/rolebased.guard";
import { Role } from "./enums/roles.enums";
import { Roles } from "../custom-decarators/custom-roles-decarator";
import { MenuCustomdecarators } from "./swagger-menu/swagger-menu-decarator";
import { MenuExceptionConstants } from "./constants/exception.constants";


@ApiTags("Menu")
@Controller('menu')
@UseInterceptors(RecentsearchInterceptor)
@Roles(Role.Manager)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class Menucontroller {
   constructor(private menuService: MenuService) { }


   // @Get('/')
   // @Roles(Role.Waiter)
   // async getAllMenu()
   // {
   //   return await this.menuService.getAllItems();
   // }

   /*Obtain the menuitem using given menuitemid*/
   @Roles(Role.Waiter)
   @MenuCustomdecarators('Get', '/:id')
   @Get('item/:id')
   async getMenuItemsById(@Param('id') id: number) {
      return await this.menuService.getMenuItemById(id);
   }

   @Get()
   getAllMenuItems() {
      return this.menuService.getAllItems();
   }


   /*Sorting the menuitems using item name or category*/
   @Get('/filter')
   @MenuCustomdecarators('Get', '/filter')
   @ApiQuery({name: 'itemName', required : false})
   @ApiQuery({name: 'category', required : false})
   async getMenuByName(@Query('itemName',) ItemName: string, @Query('category') category: string) {
      try {
         if (ItemName) {
            
            return await this.menuService.getMenuItemsByName(ItemName);
         }
         else if (category) {
            return await this.menuService.getMenuItemsByCategory(category);
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

   /*This creates the new menu category*/
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
   @Post(':id/menuitem')
   async addMenuItem(@Body() menuItem: MenuItemDto, @Param('id', ParseIntPipe) id: number) {
      return await this.menuService.addMenuItem(menuItem, id);
   }
}