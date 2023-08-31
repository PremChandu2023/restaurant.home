import { Injectable } from "@nestjs/common"

@Injectable()
export class GetLoginDto {
    JwtAccessToken :string
    JwtrefereshToken:string
}