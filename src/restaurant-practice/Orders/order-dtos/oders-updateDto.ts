import { Injectable } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"


@Injectable()
export class updateOrderDto {
    @ApiProperty({example : 'Pancakes'})
    @IsNotEmpty()
    menuItem:string
    @ApiProperty({example : 10})
    @IsNotEmpty()
    quantity:number
}