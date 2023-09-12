import { entityDefault } from ".";

export const DATABASE_CONFIG =  () => ({
   
        database : {
        type : 'mysql',
        host : process.env['DB_HOST'],
        port :Number( process.env['DB_PORT']),
        username: process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE1,
        autoLoadEntities: true,
        synchronize: true,
        logging : true
    }

})

/*namespace is the DATEBASE_CONFIG which is name for given for database config as first argument for register as method from config package */