import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express'

@Injectable()
export class EmployeeAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const token = await this.getTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException({message :"Token is not present"});
        }
        try {
          await this.jwtService.verifyAsync(token, {
                secret: 'employeesecretkey' ,
            })
            // console.log(payload);
            
        }
        catch(error)
        {
            if(error.name === 'TokenExpiredError')
            {    
                throw new HttpException({message : "Given_Token_has_been_expired"}, HttpStatus.FORBIDDEN);
            }
            else if(error.name === 'JsonWebTokenError')
            {
                throw new UnauthorizedException({message :'Invalid_token'});
            }
            else {
                throw new UnauthorizedException({message :'Authentication_failed'});
            }
        }
        return true;
    }

    async getTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }


}