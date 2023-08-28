import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class createRoleDto {
    @IsNotEmpty()
    @IsString()
    roleName : string

    @ApiProperty({example : "Have permissions to change an employee"})
    description : string
}