import { ApiProperty } from "@nestjs/swagger";
import { MenuItemStatus } from "../Enums/menuItem.status";
import { IsNotEmpty } from "class-validator";


export class UpdateStatusDto {
    @ApiProperty({enum: MenuItemStatus, example: {status :'Available'}})
    @IsNotEmpty()
    status : MenuItemStatus
}