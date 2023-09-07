import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { OrderApiResponse } from "./orders.swaggers.api";

export function OrderCustomdecator (method: string, route:string)
{
    switch(method){
        case 'Post':
            switch(route) {
                case '/':
                    return applyDecorators(
                        ApiOperation({description:"Creates a new order"}),
                        ApiOkResponse(OrderApiResponse.post.created),
                        ApiBadRequestResponse(OrderApiResponse.post.Badrequest),
                        ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                    )
         }
         case 'Get':
            switch(route) {
                case '/:id':
                    return applyDecorators(
                        ApiOperation({ description: 'Gives the details of the the order with given orderId'}),
                        ApiOkResponse(OrderApiResponse.get.ok),
                        ApiNotFoundResponse(OrderApiResponse.get.notFound),
                       ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                    )
                case '':
                    return applyDecorators(ApiOperation({description : 'Gives the list of all objects of orders '}),ApiOkResponse(OrderApiResponse.get.ok))
                case '/byname/:name':
                return applyDecorators(ApiOkResponse(OrderApiResponse.get.ok),
                ApiNotFoundResponse(OrderApiResponse.get.notFound)),
                ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                
            }
            case 'Put':
                switch(route) {
                    case '/itemquantity:id':
                    return applyDecorators((ApiOperation({description: 'Update the quantity of the given menuitem of a particular order with given OrderItemid'})),ApiOkResponse(OrderApiResponse.put.ok),
                    ApiBadRequestResponse(OrderApiResponse.put.NotFound),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                    ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                    case '/:id/addItem':
                    return applyDecorators(ApiOperation({description:'Adds the another menuitem for the given order'}),ApiOkResponse(OrderApiResponse.put.addMenUitem.ok),
                       ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                    // ApiBadRequestResponse(OrderApiResponse.put.addMenUitem.BadRequest))
                    // ApiUnauthorizedResponse(ApiResponses.get.unauthorized),
                    // ApiForbiddenResponse(ApiResponses.get.forbidden))
                }
            case 'Patch':
                switch(route)
                {
                    case 'approved/:id':
                        return applyDecorators(ApiOperation({description: 'Update the payment status as approved using the given OrderId'}),
                            ApiOkResponse(OrderApiResponse.Patch.ok),
                            ApiBadRequestResponse(OrderApiResponse.Patch.IdNotFound)
                        )
                    case 'declined/:id':
                        return applyDecorators(ApiOperation({description: 'Update the payment status as declined using the given OrderId'}),
                        ApiOkResponse(OrderApiResponse.Patch.ok),
                        ApiBadRequestResponse(OrderApiResponse.Patch.IdNotFound))
                        
                }
                case 'Delete':
                    switch(route)
                {
                    case ':Orderid':
                        return applyDecorators(ApiOperation({description: 'Deletes the odrer with given orderid'}),
                            ApiOkResponse(OrderApiResponse.Delete.ok),
                            ApiBadRequestResponse(OrderApiResponse.Delete.IdNotFound)
                        )
                    case ':orderItemId':
                        return applyDecorators(ApiOperation({description : 'Update the payment status as declined using the given OrderId' })),
                        ApiOkResponse(OrderApiResponse.Patch.ok),
                        ApiBadRequestResponse(OrderApiResponse.Patch.IdNotFound)
                }
    }
}