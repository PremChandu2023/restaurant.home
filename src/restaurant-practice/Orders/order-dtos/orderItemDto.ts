import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { createOrderDTo } from "./createOrderDto";


@Injectable()
export class OrderItemDTo {
    @ApiProperty({example : 1})
    @IsNumber()
    @IsNotEmpty({message: 'menuItemId should not be empty'})
    menuItemId:number;

    @ApiProperty({example : 2})
    @IsNumber()
    @IsNotEmpty({message: 'quantity cannot be null'})
    quantity:number
    
}
