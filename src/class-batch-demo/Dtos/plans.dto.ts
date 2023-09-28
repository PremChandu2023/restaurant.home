import { IsString, ValidateNested, IsEnum, IsNumber, IsArray, IsInt } from "class-validator";
import { DiscountTypeEnum } from "../Constants/createBatch.enums";
import { ValidationErrorConstants } from "../Constants/validation.error.constants";

export class PlansSchemaDto {
    @IsString()
    title: string;
  
    @IsArray({})
    @IsInt({each: true})
    applicableBatchIds: number[];
  
    @IsEnum(DiscountTypeEnum, {
      message: ValidationErrorConstants.CONST_ERROR_DISCOUNTTYPE_MUST_BE_STRING_WITH_ENUM,
    })
    discountType: string;
  
    @IsNumber({}, { message: ValidationErrorConstants.CONST_ERROR_DISCOUNT_VALUE_MUST_BE_FLOAT_TYPE})
    discountValue: number;
  }