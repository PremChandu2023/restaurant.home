import { ApiProperty, ApiResponse } from "@nestjs/swagger"
import { IS_STRONG_PASSWORD, IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class loginEmployeeDto {

    @ApiProperty({type : IsEmail, example : 'prem3a3@gmail.com'})
    @IsNotEmpty()
    @IsEmail()
    email:string

    @ApiProperty({ example: 'Prem@12345678'})
    @IsNotEmpty()
    password:string
}