import { NestApplicationOptions } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { transports, format } from 'winston';

export const loggerConfig: NestApplicationOptions = {
  logger: WinstonModule.createLogger({
    transports: [
      new transports.File({ filename: 'D:/Nest.js _practice/restaurant-task/restaurant.home/src/Loggers/logs.combinedlog' ,level: 'error'}),
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.cli({ all: true }),
          format.splat(),
          format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }),
        ),
      }),
    ],
  }),
};
