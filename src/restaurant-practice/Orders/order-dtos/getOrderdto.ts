import { Injectable } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { orderDetails } from "../orders.dtos"

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