import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { restaurentdatabase } from './databse.config';
import { Ordermodule } from './Restaurant/Orders/order-module';
import { Menumodule } from './Restaurant/Menu/menu.module';
import { AuthModule } from './Restaurant/Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { restaurentdatabase, restaurentdatabass } from './configurations/databse.config';
import { DATABASE_CONFIG } from './configurations/database.config';
import { DatabaseConfig } from './configurations/database.configure.service';
import { LoggerMiddleware } from './Restaurant/Middlewares/logger.middleware';
import { RestaurantModule } from './Restaurant/restaurant/restaurant.module';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ClassBatchDemoModule } from './class-batch-demo/class-batch-demo.module';@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ThrottlerModule.forRoot([{ttl: 60, limit: 2}]),
    Ordermodule,
    RestaurantModule,
    Menumodule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [DATABASE_CONFIG] }),
    ClassBatchDemoModule,
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD,useClass: ThrottlerGuard}],
  
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
