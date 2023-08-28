import { IsNotEmpty, IsString } from "class-validator";

export class createRoleDto {
    @IsNotEmpty()
    @IsString()
    roleName : string
}