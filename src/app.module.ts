import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { restaurentdatabase } from './databse.config';
import { Ordermodule } from './restaurant-practice/Orders/order-module';
import { Menumodule } from './restaurant-practice/Menu/menu.module';
import { AuthModule } from './restaurant-practice/Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { restaurentdatabase, restaurentdatabass } from './configurations/databse.config';
import { DATABASE_CONFIG } from './configurations/database.config';
import { DatabaseConfig } from './configurations/database.configure.service';
@Module({
  imports : [TypeOrmModule.forRootAsync({imports: [ConfigModule], useClass: DatabaseConfig}),Ordermodule,Menumodule,AuthModule, ConfigModule.forRoot({isGlobal:true
  ,load: [DATABASE_CONFIG]})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
