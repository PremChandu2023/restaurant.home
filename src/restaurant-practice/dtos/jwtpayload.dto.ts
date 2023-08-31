import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtPayloadDto {
    userId :number
}