import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  MaxLength,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsOptional,
  ValidateIf,
  Validate,
  IsNotEmptyObject,
} from 'class-validator';
import { PlansSchemaDto } from './plans.dto';
import { RecurringPatternDto } from './recurringPattern.dto';
import { EligibilityCriteriaDto } from './eligibillityCriteria.dto';
import { IsNull } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Logger, log } from 'winston';
import { ValidationErrorConstants } from '../Constants/validation.error.constants';

export class CreateBatchDto {
  @IsInt()
  @IsNotEmpty()
  termId: number;

  @IsNotEmpty()
  @MaxLength(50, { message: ValidationErrorConstants.CONST_ERROR_TITILE_LIMIT })
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @IsNotEmpty()
  instructor: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, {
    message: ValidationErrorConstants.CONST_ERROR_FEE_PER_CLASS,
  })
  feePerClass: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: ValidationErrorConstants.CONST_ERROR_MAX_CAPACITY })
  maxCapacity: number;

  @IsBoolean() //by default  recurring is false\
  @IsNotEmpty()
  recurring: boolean = false;

  @IsDateString(
    {},
    {
      message:
        ValidationErrorConstants.CONST_ERROR_FROM_MUST_BE_STRING_DATE_TIME_FORMAT,
    },
  )
  @IsNotEmpty()
  from: string;

  @ValidateIf((object) => object.recurring === false)
  @IsDateString(
    {},
    {
      message:
        ValidationErrorConstants.CONST_ERROR_FROM_MUST_BE_STRING_DATE_TIME_FORMAT,
    },
  )
  @IsNotEmpty()
  // TODO: if recurring is false "to" is mandatory, it applies @Isnotempty validation
  to: string | null;

  //TODO: if recurring is false recurringPattern shouldn’t be passed or must be null
  @ValidateIf((object, value) => {
    if (object.recurring === false) {
      if (!value) {
        return false;
      } else {
        throw new BadRequestException({
          message:
            ValidationErrorConstants.CONST_ERROR_RECURRING_PATTERN_NOT_NULL,
        });
      }
    }
    return true;
  })
  @ValidateNested()
  @Type(() => RecurringPatternDto)
  recurringPattern: RecurringPatternDto;

  @ValidateNested({ each: true, })
  @Type(() => EligibilityCriteriaDto)
  @IsNotEmpty({each: true})
  eligibilityCriteria: EligibilityCriteriaDto[];

  @ValidateNested({ each: true })
  @Type(() => PlansSchemaDto)
  plans: PlansSchemaDto[];
}
