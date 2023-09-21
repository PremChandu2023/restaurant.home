import { ApiProperty, ApiResponse } from "@nestjs/swagger"

export class getMenuItemDto {
  @ApiProperty({example : 1})
  menuitem_id:number
  @ApiProperty({example : 'Pancakes'})
  menu_itemname:string
  @ApiProperty({example : 20})
  price:number
  @ApiProperty({example : 'Starters'})
  menu_type : string
}