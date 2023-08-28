import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { OrderApiResponse } from "./orders.swaggers.api";

export function OrderCustomdecator (method: string, route:string)
{
    switch(method){
        case 'Post':
            switch(route) {
                case '/':
                    return applyDecorators(
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
                        ApiOkResponse(OrderApiResponse.get.ok),
                        ApiNotFoundResponse(OrderApiResponse.get.notFound),
                       ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                    )
                case '/byname/:name':
                return applyDecorators(ApiOkResponse(OrderApiResponse.get.ok),
                ApiNotFoundResponse(OrderApiResponse.get.notFound)),
                ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                
            }
            case 'Put':
                switch(route) {
                    case '/itemquantity:name':
                    return applyDecorators(ApiOkResponse(OrderApiResponse.put.ok),
                    ApiNotFoundResponse(OrderApiResponse.put.NotFound)),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                    ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                    case '/:id/addItem':
                    return applyDecorators(ApiOkResponse(OrderApiResponse.put.addMenUitem.ok),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                    // ApiBadRequestResponse(OrderApiResponse.put.addMenUitem.BadRequest))
                    // ApiUnauthorizedResponse(ApiResponses.get.unauthorized),
                    // ApiForbiddenResponse(ApiResponses.get.forbidden))
                }
    }
}