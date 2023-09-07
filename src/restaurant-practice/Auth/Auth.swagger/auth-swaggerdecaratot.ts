import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthApiResposnes } from "./swagger.apiresposne";
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
                        ApiOperation({description:'Gives the order details by id'}),ApiOkResponse(AuthApiResposnes.getById.ok),
                    ApiBadRequestResponse(AuthApiResposnes.getById.Badrequest))
            }
        case 'Post':
            switch(route)
            {
                case 'register':
                    return applyDecorators(
                        ApiOperation({description:' registers the new user'}),ApiOkResponse(AuthApiResposnes.post.Usersuccess),
                    ApiBadRequestResponse(AuthApiResposnes.post.UserbadRequest),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                       ApiForbiddenResponse(OrderApiResponse.put.frbidden))
                case 'login':   
                    return applyDecorators(
                        ApiOperation({description:'Gives the jwt token and referesh token with validating the user credentials'}),ApiOkResponse(AuthApiResposnes.post.success),
                    ApiBadRequestResponse(AuthApiResposnes.post.UserbadRequest)),
                    ApiUnauthorizedResponse(OrderApiResponse.put.Unauthorized),
                    ApiForbiddenResponse(OrderApiResponse.put.frbidden)
                case 'refereshtoken':
                    return applyDecorators(ApiOperation({description: 'Checks the expired date of referesh token and returns a new generated jwt access token'}),
                    ApiBody({schema: {properties: {refereshtoken : {type:'string'}}}}),
                    ApiOkResponse(AuthApiResposnes.posttoken.ok))
                case 'roles':
                    return applyDecorators(ApiOkResponse(AuthApiResposnes.PostRole.ok),
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
                        ApiOkResponse(AuthApiResposnes.PutRole.ok),
                        ApiBadRequestResponse(AuthApiResposnes.PutRole.BadRequest),
                        
                    )
            }

    }

    }