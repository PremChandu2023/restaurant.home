import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class registerEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example : 'A23'})
    employee_Id:string

    @ApiProperty({example : 'A23'})
    @IsString()
    @IsNotEmpty()
    employee_Name: string

    @ApiProperty({example : 'Active'})
    status:string 

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example : 'prem3a3@gmail.com'})
    email:string


    @IsNotEmpty()
    @IsStrongPassword({minLength: 8, minLowercase:1,minNumbers:1,minSymbols:1,minUppercase:1})
    @ApiProperty({example : 'Prem@12345678'})
    password:string

    phoneNumber:number
    @IsNotEmpty()
    @ApiProperty({example : 'Manager'})
    role: string


}