import { IsAlpha, IsArray, IsEnum, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { OrderItem } from "../Entities/orderitem.entity";
import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../Menu/enums/order.enum";
import { PaymentStatus } from "../Menu/enums/payment.enum";

@Injectable()
export class MenuDto  {
    @IsNotEmpty()
    @ApiProperty({example: 'Starters'})
    menu_name:string
}
@Injectable()
export class MenuItemDto  {
    @ApiProperty({example : 'Pancakes'})
    @IsNotEmpty()
    @IsAlpha()
    menu_itemname:string
    @ApiProperty({example : 20})
    @IsNotEmpty()
    price:number;   
}
// @Injectable()
// export class OrderItemDTo {
//     // @ApiProperty({example : 1})
//     @IsNumber()
//     @IsNotEmpty()
//     menuItemId:number;

//     // @ApiProperty({example : 2})  
//     @IsNumber()
//     @IsNotEmpty()
//     quantity:number
    
// }

// @Injectable()
// export class getOrderDto {
//     @ApiProperty()
//      order_Id : number
//      @ApiProperty()
//      customer_Name:string
//      @ApiProperty()
//      orderDetails: orderDetails[]
//      @ApiProperty()
//      totalPrice: number
// }
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