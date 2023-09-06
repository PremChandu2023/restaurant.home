import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { readFileSync, writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export function setupSwagger(app: INestApplication): void {
  console.log('sjdbsdhjdg');
  
        
    // const ymlpath =  join(__dirname,'swagger/swagger.yml')
    // const openApiYml =readFileSync(ymlpath, 'utf8');
    // const swaggerDocument = yaml.load(openApiYml);


  const options = new DocumentBuilder()
    .setTitle('Resaturant')
    .setDescription('This is swagger documentation for restaurant ')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000') 
    .build();

   

  const document = SwaggerModule.createDocument(app, options);
  // console.log(JSON.stringify(document))
  // writeFileSync("D:/Nest.js _practice/nest_practice/src/swagger/swagger-spec.json", JSON.stringify(document));

  const swaggerYaml = yaml.dump(document, { indent: 2 });

  // writeFileSync('D:/Nest.js _practice/restaurant-task/restaurant.home/src/swagger/swagger.yml', swaggerYaml, 'utf8');


  SwaggerModule.setup('api1', app, document);
}
