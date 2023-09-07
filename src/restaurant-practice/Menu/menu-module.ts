import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { Menucontroller } from "./menu-controller";
import { AuthorisationMiddlware, Useragent, userAgent } from "../middlewares/user-agent-middlewares";
import { MenuService } from "./menu-service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "../Entities/menu.entity";
import { MenuItems } from "../Entities/menuitem.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({

controllers : [Menucontroller],
imports: [TypeOrmModule.forFeature([Menu,MenuItems]), JwtModule.register({
    secret: 'employeesecret',
    signOptions : {algorithm : 'HS512',
    expiresIn : '1d'
                }
})],
providers : [MenuService]
})
export class Menumodule  {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //     .apply(Useragent)
    //     .exclude({path: "menu/id" , method : RequestMethod.POST},{path: "menu/id" , method : RequestMethod.ALL})
    //     .forRoutes();
    // }

}