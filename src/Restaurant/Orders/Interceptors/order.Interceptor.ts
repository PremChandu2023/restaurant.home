import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as cacheManager from 'cache-manager'
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
export class OrderCustomInterceptor implements NestInterceptor {
     constructor(private cacheManager: cacheManager.Cache ){}
      intercept(context: ExecutionContext,next: CallHandler) : Observable<any>{
        const request = context.switchToHttp().getResponse<Request>();
        const Key = this.generateCacheKey(request);

        const cachedResponse =this.cacheManager.get(Key);

        if(cachedResponse)
        {
            return  of(cachedResponse);
        }
      
        return next.handle().pipe(
            tap(response => {
                const ttl=60;
                this.cacheManager.set(Key,response, ttl);   
            })
        )
    }
    private generateCacheKey(request){
        const httpMethod = request.method
        const httpUrl = request.url;
        return `${httpMethod}_${httpUrl}`;
    }

}