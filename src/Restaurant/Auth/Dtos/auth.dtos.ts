import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IS_ENUM, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { Role } from "src/Restaurant/Enums/roles.enums";

@Injectable()
export class createRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({enum : Role})
    roleName : string

    @ApiProperty({example : "Have permissions to change an employee"})
    description : string
}


@Injectable()
export class JwtPayloadDto {
    userId :number
}
export class loginEmployeeDto {

    @ApiProperty({type : IsEmail, example : 'prem3a3@gmail.com'})
    @IsNotEmpty()
    @IsEmail()
    email:string

    @ApiProperty({ example: 'root123'})
    @IsNotEmpty()
    password:string
}
@Injectable()
export class GetLoginDto {
    JwtAccessToken :string
    JwtrefereshToken:string
}

@Injectable()
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
    // @IsStrongPassword({minLength: 8, minLowercase:1,minNumbers:1,minSymbols:1,minUppercase:1})
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
@Injectable()
export class updateRoleDto {
    @ApiProperty({example:'Manager'})
    name: string

    @ApiProperty({example : "Have permissions to change an employee"})
    description : string
}
