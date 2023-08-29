import { ApiProperty, ApiResponse } from "@nestjs/swagger"
import { IS_STRONG_PASSWORD, IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class loginEmployeeDto {

    @ApiProperty({type : IsEmail, example : 'prem@gmail.com'})
    @IsNotEmpty()
    @IsEmail()
    email:string

    /*checks the password validation according to the Passwordvalidations given the Isstrongpassword decarator*/
    @ApiProperty({type : IS_STRONG_PASSWORD, example: 'prem@123'})
    @IsNotEmpty()
    @IsStrongPassword({minLength : 5, minLowercase:1, minSymbols:1,minNumbers:1,minUppercase:1})
    password:string
}