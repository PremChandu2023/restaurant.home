import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";


@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private configService:ConfigService){}
    createTypeOrmOptions()  {
        // console.log(this.configService.get('database'));
        
        return this.configService.get('database');
        
    }

}