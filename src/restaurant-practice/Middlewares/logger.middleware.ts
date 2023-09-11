import { Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response} from 'express'

export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP')
    use(req: Request, res: Response, next: (error?: any) => void) {
        const { ip, method, originalUrl} = req;

        this.logger.log(
            `Request handler recieved a request with method: ${method} and route: ${originalUrl}`),
        next();
    }
    
}