import { IsString, IsEnum, IsNotEmpty } from "class-validator";
import { EligibiltyKey, CompareOperator } from "../Constants/createBatch.enums";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EligibilityCriteriaDto {
    @IsEnum(EligibiltyKey, {
      message: 'It should be either age or gender',
    })
    @IsNotEmpty()
    @IsString()
    key: string;
  
    @IsEnum(CompareOperator, {
      message: 'It should be either equals, not_equals, greater_than, less_than',
    })
    compareOperator: string;
  
    @IsString()
    value: string | number;
  }