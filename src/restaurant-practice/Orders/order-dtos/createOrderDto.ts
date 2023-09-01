import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, isNumber } from "class-validator";
import { OrderItemDTo } from "./orderItemDto";

@Injectable()
export class createOrderDTo {
    @ApiProperty({example : "Sukesh"})
    @IsNotEmpty({message: 'Customer Name should not be empty'})
    customerName:string

    @IsNotEmpty({message : 'Table should not be empty'})
    @IsNumber()
    tableNumber: number

    
    @ApiProperty({ type : [OrderItemDTo] ,example : [ {
        "menuItemId": 3,
        "quantity": 1
    }, {
        "menuItemId": 4,
        "quantity": 1
    }]})
    items:OrderItemDTo[];
}