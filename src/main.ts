import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AuthGuard } from './Restaurant/guards/Auth-guard';
import { Validator } from 'class-validator';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './Restaurant/Exception-Filters/exception.filters';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger/swagger-config/swaggers';
import { DatabaseClass } from './swagger/swagger.practices/swagger.config';
import { loggerConfig } from './Loggers/winston.loggerconfig';
import { loggers } from 'winston';
import { GlobalResponseInterceptor } from './Restaurant/Interceptors/menu.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  // app.useGlobalGuards(new AuthGuard())
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError:true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties:false,
      validationError: {
        target:false
      }
    }),
  );
  app.useGlobalInterceptors(new GlobalResponseInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT_NUMBER');

  // console.log(name);

  console.log(port);

  await app.listen(port);
  const logger = new Logger('PORT')
  logger.log(`Port is running on port number:${port}`);
  /**
   * If we add any new dependecies in nest js application we have to restart the program*/

}
bootstrap();
