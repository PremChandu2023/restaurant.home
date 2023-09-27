import { IsString, ValidateNested, IsEnum, IsNumber, IsArray, IsInt } from "class-validator";
import { DiscountTypeEnum } from "../Enums/createBatch.enums";

export class PlansSchemaDto {
    @IsString()
    title: string;
  
    @IsArray()
    @IsInt({each: true})
    applicableBatchIds: number[];
  
    @IsEnum(DiscountTypeEnum, {
      message: 'Discount type must be one of: flat, percentage',
    })
    discountType: string;
  
    @IsNumber({}, { message: 'discountValue must be a valid number' })
    discountValue: number;
  }