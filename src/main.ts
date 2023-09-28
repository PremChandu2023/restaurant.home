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
      transform: true,// Automatically transform incoming data to match the DTO class
      whitelist: true,// Strips away unexpected properties from the request
      forbidNonWhitelisted: true,// Throws an error if unexpected properties are present in the request
      skipMissingProperties:false,// Throws an error if any of the expected properties are missing
      validationError: {
        target:false// Exclude the entire object from the response, showing only field-level errors
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
