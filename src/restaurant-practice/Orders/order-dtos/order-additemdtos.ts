import { Injectable } from "@nestjs/common";
import { OrderItemDTo } from "./orderItemDto";
import { ApiProperty } from "@nestjs/swagger";


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