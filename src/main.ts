import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swaggers';
import { AuthGuard } from './restaurant-practice/guards/Auth-guard';
import { Validator } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './restaurant-practice/Orders/Exception-Filters/exception.filters';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  
  // const options = new DocumentBuilder()
  //   .setTitle("Swagger application")
  //   .setDescription("Practice apis")
  //   .setVersion("1.0")
  //   .addBearerAuth({
  //     type : "http",
  //     scheme : "bearer",
  //     bearerFormat : "JWT",
  //     name : "JWT",
  //     description : "Enter JWT token",
  //     in : "header"
  //   },"JWT-auth")
  //   .build()
    

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  // app.useGlobalGuards(new AuthGuard())
  app.useGlobalPipes(new ValidationPipe({transform : true}));
  app.useGlobalFilters(new GlobalExceptionFilter())

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT_NUMBER");
  console.log(port);
  
  await app.listen(port);



  // const document = SwaggerModule.createDocument(app, options,)
  // SwaggerModule.setup("api", app, document)
  // await app.listen(3000);
}
bootstrap();