// import { INestApplication } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
// import { readFileSync, writeFileSync } from 'fs';
// import * as yaml from 'js-yaml';
// import { join } from 'path';

import { MigrationInterface, QueryRunner } from "typeorm";

// export function setupSwagger(app: INestApplication): void {
        
//     // const ymlpath =  join(__dirname,'swagger/swagger.yml')
//     // const openApiYml =readFileSync(ymlpath, 'utf8');
//     // const swaggerDocument = yaml.load(openApiYml);


//   const options = new DocumentBuilder()
//     .setTitle('chandu')
//     .setDescription('Your API Description')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .addServer('http://localhost:3000') 
//     .build();

   

//   const document = SwaggerModule.createDocument(app, options);
//   // console.log(JSON.stringify(document))
//   writeFileSync("D:/Nest.js _practice/nest_practice/src/swagger/swagger-spec.json", JSON.stringify(document));

//   const swaggerYaml = yaml.dump(document, { indent: 2 });

//   writeFileSync('D:/Nest.js _practice/nest_practice/src/swagger/swagger.yml', swaggerYaml, 'utf8');


//   SwaggerModule.setup('api1', app, document);
// }

export class DatabaseClass implements MigrationInterface {
    name?: string;
    transaction?: boolean;
    async up(queryRunner: QueryRunner) {
      return await  queryRunner.query(`SELECT * FROM roles`);

    }
    down(queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}