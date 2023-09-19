import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { classToPlain, instanceToPlain } from "class-transformer";
import { log } from "winston";



@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        return next.handle().pipe(map((result) => {
            const modifiedResult = instanceToPlain(result, {excludePrefixes : ['date']})
            
           const modifiedResponse = {
            succes: true,
            data : modifiedResult
           }
            return modifiedResponse;

        }))
    }
}