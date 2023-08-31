import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { loginEmployeeDto } from "src/restaurant-practice/dtos/login.employeeDto";
import { UnauthorizedException } from "@nestjs/common";


export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService:AuthService)
    { 
        super();
    }
    
    async validate(logindto:loginEmployeeDto)
    {
        const user =await this.authService.checkLogin(logindto);
        if(!user)
        {
            throw new UnauthorizedException({message : 'unauthorized in loacl strategy'});
        }

        return user;
    }

}