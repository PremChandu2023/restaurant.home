import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

@Injectable()
export class createRestaurantDto {
    @ApiProperty()
    @IsNotEmpty()
    name:string
    
    @ApiProperty()
    @IsNotEmpty()
    location:string

}

@Injectable()
export class AddMenuItemDto {
    @ApiProperty()
    @IsNotEmpty()
    menu_itemname:string
    
    @ApiProperty()
    @IsNotEmpty()
    price:number

    @ApiProperty()
    @IsOptional()
    tax:number

}