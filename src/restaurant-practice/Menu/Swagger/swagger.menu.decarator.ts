import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { MenuResponses } from "./swagger.resposnes.menu";
import { MenuDto } from "src/restaurant-practice/Orders/orders.dtos";


export function MenuCustomdecarators(method:string,route:string)
{
    switch(method){
        case 'Get':
            switch(route)
            {
                case '/:id':
                    return applyDecorators(
                        ApiOperation({description: 'Get the menu items by id'}),
                        ApiOkResponse(MenuResponses.getById.ok),
                        ApiBadRequestResponse(MenuResponses.getById.Idnotfound)
                    )
                case '/filter':
                    return applyDecorators(
                        ApiOperation({description: 'Gives the Filtered menuitems based upon menuitemname or category'}),ApiOkResponse(MenuResponses.filterGetByName.ok))
                case '/':
                    return applyDecorators(ApiOperation({description: 'Gives all the list of menuitems'}),ApiOkResponse(MenuResponses.get.ok))
                }
        case 'Post':
            switch(route)
            {
                case '/':
                    return applyDecorators(ApiOperation({description: 'Creates a new menuitem category'}),
                    ApiOkResponse(MenuResponses.addMenu.ok),
                    ApiBadRequestResponse(MenuResponses.addMenu.BadRequest))
                case ':id/menuitem':
                    return applyDecorators(ApiOperation({description: 'Creates a new menuitem with menuId as a category'}),
                        ApiOkResponse(MenuResponses.addMenuItem.ok),
                        ApiBadRequestResponse(MenuResponses.addMenuItem.BadRequest)
                    )

            }
        case 'Delete':
            switch(route)
            {
                case '/':
                    return applyDecorators()
            }

    }
}