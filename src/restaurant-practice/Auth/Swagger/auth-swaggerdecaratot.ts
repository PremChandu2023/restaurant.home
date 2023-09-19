import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthApiResposnes } from "./swagger.apiresponses";
import { OrderApiResponse } from "src/restaurant-practice/Orders/orders-swaggers/orders.swaggers.api";


export function AuthCustomdecarators(method:string,route:string)
{
    switch(method)
    {
        case 'Get':
            switch(route)
            {
                case ':id/details':
                    return applyDecorators(
                        ApiOperation({summary:'Gives the order details by orderId'}),ApiOkResponse(AuthApiResposnes.getById.ok),
                    ApiBadRequestResponse(AuthApiResposnes.getById.Badrequest))
            }
        case 'Post':
            switch(route)
            {
                case 'register':
                    return applyDecorators(
                        ApiOperation({summary:' registers the new user'}),ApiOkResponse(AuthApiResposnes.post.Usersuccess),
                    ApiBadRequestResponse(AuthApiResposnes.post.UserbadRequest),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                case 'login':   
                    return applyDecorators(
                        ApiOperation({summary:'Gives the jwt token and referesh token with validating the user credentials'}),ApiOkResponse(AuthApiResposnes.post.success),
                    ApiBadRequestResponse(AuthApiResposnes.post.UserbadRequest),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                    ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                case 'refereshtoken':
                    return applyDecorators(ApiOperation({summary: 'Checks the expired date of referesh token and returns a new generated jwt access token'}),
                    ApiBody({schema: {properties: {refereshtoken : {type:'string'}}}}),
                    ApiOkResponse(AuthApiResposnes.posttoken.ok))
                case 'roles':
                    return applyDecorators(ApiOperation({summary: 'Creates the new roles for users'}),ApiOkResponse(AuthApiResposnes.PostRole.ok),
                    ApiBadRequestResponse(AuthApiResposnes.PostRole.Conflict),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden))
            }
            case 'Put':
            switch(route)
            {
                case 'role/:id':
                    return applyDecorators(
                        //usersrole
                        ApiOperation({summary: 'Updates the roles with given menuId'}),
                        ApiOkResponse(AuthApiResposnes.PutRole.ok),
                        ApiBadRequestResponse(AuthApiResposnes.PutRole.BadRequest),
                        
                    )
            }

    }

    }