import { AuthGuard } from "@nestjs/passport";


export class PassportAuthGuard extends AuthGuard('local') {}