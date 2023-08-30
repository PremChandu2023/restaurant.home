import { ApiProperty } from "@nestjs/swagger";
import { IS_ENUM, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../Menu/enums/roles.enums";

export class createRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({enum : Role})
    roleName : string

    @ApiProperty({example : "Have permissions to change an employee"})
    description : string
}
