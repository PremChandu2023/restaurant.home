import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, MaxLength, IsString, IsNumber, Min, IsBoolean, IsDateString, ValidateNested, IsOptional } from "class-validator";
import { PlansSchemaDto } from "./plans.dto";
import { RecurringPatternDto } from "./recurringPattern.dto";
import { EligibilityCriteriaDto } from "./eligibillityCriteria.dto";

export class CreateBatchDto {
    @IsInt({message : "must be only an integer type"})
    @IsNotEmpty()
    termId: number;
  
    @IsNotEmpty()
    @MaxLength(50, { message: 'Title length must be less than 50' })
    title: string;
  
    @IsString()
    description: string;
  
    @IsInt({message: 'must be an Integer type'})
    instructor: number;
  
    @IsNumber({},{message: 'IS A NUMBER'})
    @IsNotEmpty()
    @Min(0.01, {message: 'must accept only the Float data type, which is >= 0.01'})
    feePerClass: number;
  
    @IsInt()
    @IsNotEmpty()
    @Min(1,{message:'must accept only an integer type, which is >= 1'})
    maxCapacity: number;
  
    @IsBoolean()
    recurring: boolean = true;
  
    @IsDateString()
    @IsNotEmpty()
    from: string;
  
    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    // TODO: 
    to?: string;
  
    @ValidateNested()
    @Type(() => RecurringPatternDto)
    recurringPattern: RecurringPatternDto;
  

    @ValidateNested({ each: true })
    @Type(() => EligibilityCriteriaDto)
    eligibilityCriteria: EligibilityCriteriaDto[];
  
    @ValidateNested({ each: true })
    @Type(() => PlansSchemaDto)
    plans: PlansSchemaDto[];
  }



  