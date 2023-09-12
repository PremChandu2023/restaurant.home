import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class createRestaurantDto {
    @ApiProperty()
    name:string
    
    @ApiProperty()
    location:string

    @ApiProperty()
    menuItemName:string


}