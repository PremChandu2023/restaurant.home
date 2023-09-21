import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export class JwtStrategy  extends PassportStrategy(Strategy){
    constructor()
    {
        super({jwtRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration :false,
                secretOrKey : 'employeesecret'});
    }

    async validate(payload: any)
    {
        return payload;
    }

}