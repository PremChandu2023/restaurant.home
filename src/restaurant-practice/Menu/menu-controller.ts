import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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


@ApiTags("Menu")
@Controller('menu')
@UseInterceptors(RecentsearchInterceptor)
@Roles(Role.Manager)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class Menucontroller {
   constructor(private menuService:MenuService){}


// @Get('/')
// @Roles(Role.Waiter)
// async getAllMenu()
// {
//   return await this.menuService.getAllItems();
// }

@Roles(Role.Waiter)
@MenuCustomdecarators('Get','/:id')
@Get('/:id')
async getMenuItemsById(@Param('id') id:number)
{
   return await this.menuService.getMenuItemById(id);
}

@Post()
createMenu(@Body() menu:MenuDto)
{    
    return this.menuService.createMenu(menu);
}
@Roles(Role.Waiter)
@MenuCustomdecarators('Post',':id/menuitem')
@Put(':id/menuitem')
addMenuItem(@Body() menuItem:MenuItemDto,@Param('id', ParseIntPipe) id:number)
{
   return this.menuService.addMenuItem(menuItem,id);
}
}