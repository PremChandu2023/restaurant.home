import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { MenuResponses } from "./swagger-resposnes-menu";
import { getOrderDto } from "src/restaurant-practice/Orders/order-dtos/getOrderdto";
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
                        ApiBadRequestResponse(MenuResponses.getById.Badrequest)
                    )
                case '/filter':
                    return applyDecorators(ApiOkResponse(MenuResponses.filterGetByName.ok))
            }
        case 'Post':
            switch(route)
            {
                case '/':
                    return applyDecorators(ApiOperation({description: 'Creates a new menuitem category'}))
                case ':id/menuitem':
                    return applyDecorators(
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