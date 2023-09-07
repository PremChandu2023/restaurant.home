import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AuthGuard } from './restaurant-practice/guards/Auth-guard';
import { Validator } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './restaurant-practice/Exception-Filters/exception.filters';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger/swagger-config/swaggers';
import { DatabaseClass } from './swagger/swagger.practices/swagger.config';


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
  const data = new DatabaseClass();
  console.log(  data.up
    );

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT_NUMBER");
  const name = (process.env['DB_USERNAME'])
  // console.log(name);
  
  console.log(port);
  
  await app.listen(port);
/*If we add any new dependecies in nest js application we have to restart the program*/


  // const document = SwaggerModule.createDocument(app, options,)
  // SwaggerModule.setup("api", app, document)
  // await app.listen(3000);
}
bootstrap();