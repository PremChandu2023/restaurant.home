import { Injectable, ValidationPipe } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject, IsNumber, ValidateNested, isNumber } from "class-validator";
import { OrderItemDTo } from "./orderItemDto";
import { Type } from "class-transformer";


@Injectable()
export class createOrderDTo  {
    @ApiProperty({example : "Sukesh"})
    @IsNotEmpty({message: 'Customer Name should not be empty'})
    customerName:string

    @IsNotEmpty({message : 'Table should not be empty'})
    @ApiProperty({example:20})
    @IsNumber()
    tableNumber: number

    
    @ApiProperty({ type : [OrderItemDTo] ,example : [ {
        "menuItemId": 3,
        "quantity": 1
    }, {
        "menuItemId": 4,
        "quantity": 1
    }]})
    @Type(()=> OrderItemDTo)
    @ValidateNested({each: true})
    items:OrderItemDTo[];

}