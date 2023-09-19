import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { MenuResponses } from "./swagger.resposnes.menu";
import { MenuDto } from "src/restaurant-practice/Orders/orders.dtos";
import { OrderType } from "../Constants/orders.type";


export function MenuCustomdecarators(method:string,route:string)
{
    switch(method){
        case 'Get':
            switch(route)
            {
                case '/:id':
                    return applyDecorators(
                        ApiOperation({summary:  'Get the menu items by id'}),
                        ApiOkResponse(MenuResponses.getById.ok),
                        ApiBadRequestResponse(MenuResponses.getById.Idnotfound)
                    )
                case '/filter':
                    return applyDecorators(
                        ApiQuery({name: 'itemName', required : false,description: 'Get the menuitems by menuItemname'}),
                        ApiQuery({name: 'category', required : false,description: 'Get the menuitems by menuCategory'}),
                        ApiQuery({name: 'price', required : false,enum:OrderType, description: 'Get the menuitems by price in ascending order in descending order'}),
                        ApiOperation({summary: 'Gives the Filtered menuitems based upon menuitemname or category'}),ApiOkResponse(MenuResponses.filterGetByName.ok))
                case '/':
                    return applyDecorators(ApiOperation({summary: 'Gives all the list of menuitems'}),ApiOkResponse(MenuResponses.get.ok))
                }
        case 'Post':
            switch(route)
            {
                case '/':
                    return applyDecorators(ApiOperation({summary: 'Creates a new menuitem category'}),
                    ApiOkResponse(MenuResponses.addMenu.ok),
                    ApiBadRequestResponse(MenuResponses.addMenu.BadRequest))
                case ':id/menuitem':
                    return applyDecorators(ApiOperation({summary: 'Creates a new menuitem with menuId as a category'}),
                        ApiOkResponse(MenuResponses.addMenuItem.ok),
                        ApiBadRequestResponse(MenuResponses.addMenuItem.BadRequest)
                    )

            }
        case 'Delete':
            switch(route)
            {
                case '/':
                    return applyDecorators(
                        ApiOperation({summary: "Deletes the Menu with given Id"})
                    )
            }

    }
}