import { Injectable, ValidationPipe } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, ValidateNested, isNumber } from "class-validator";

import { Type } from "class-transformer";
import { PaymentStatus } from "src/Restaurant/Enums/payment.enum";

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
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=> OrderItemDTo) 
    items:OrderItemDTo[];

}

@Injectable()
export class getOrderDto {
    @ApiProperty()
     order_Id : number
     @ApiProperty()
     customer_Name:string
     @ApiProperty()
     orderDetails: orderDetails[]
     @ApiProperty()
     totalPrice: number
     paymentStatus : string
}

@Injectable()
export class updateOrderDto {
    @ApiProperty({example : 'Pancakes'})
    @IsNotEmpty()
    menuItem:string
    @ApiProperty({example : 10})
    @IsNotEmpty()
    quantity:number
}

@Injectable()
export class AddItemDtos {

    @ApiProperty({example : 2})
    order_id: number

    @ApiProperty({ type : [OrderItemDTo] ,example : [ {
        "menuItemId": 3,
        "quantity": 1
    }, {
        "menuItemId": 4,
        "quantity": 1
    }]})
    menuItems : OrderItemDTo
}
@Injectable()
export class orderDetails {
    @ApiProperty()
    order_Name: string
    @ApiProperty()
    price: number
    @ApiProperty()
    tax : number
}
@Injectable()
export class updatePaymentDTo {
    @ApiProperty({type : IsEnum, example: 'pending'})
    @IsEnum({PaymentStatus})
    orderStatus: PaymentStatus;
}
