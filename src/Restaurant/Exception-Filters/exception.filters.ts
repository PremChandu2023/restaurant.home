import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException, HttpException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import {Request, Response} from 'express'


@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();

        if(exception instanceof BadRequestException)
        {
            response.status(exception.getStatus())
            .json(exception.getResponse());
        }
        else if(exception instanceof ForbiddenException)
        {
            response.status(status).json({statusCode : status,
            error : { message : exception.message},
            timeStamp : new Date().toISOString()})
        }
        else{        
        response.status(status)
        .json({statusCode : status,
            error : { message : exception.message},
            timeStamp: new Date().toISOString(),
            path : request.url
        })
    }


    }

}