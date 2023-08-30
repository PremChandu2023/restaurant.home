import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString, IsStrongPassword } from "class-validator";
import { Role } from "../Menu/enums/roles.enums";


export class registerEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example : 'A23'})
    employee_Id:string

    @ApiProperty({example : 'PremChandu'})
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

    @ApiProperty({example: "855457145"})
    @IsNumberString()
    phoneNumber:string
    @IsNotEmpty()
    @ApiProperty({enum : Role})
    @IsEnum(Role)
    role: string


}