import { ApiProperty } from "@nestjs/swagger";

export class updateRoleDto {
    @ApiProperty({example : 'Manager'})
    name: string;

    @ApiProperty({example : "Have permissions to change an employee"})
    description : string
}