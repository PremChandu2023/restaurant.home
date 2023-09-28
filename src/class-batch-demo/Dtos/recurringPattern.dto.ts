import {
  IsDateString,
  IsInt,
  IsEnum,
  IsBoolean,
  IsOptional,
  Min,
  IsArray,
  ValidateIf,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';
import {
  IntervalEnum,
  DayOfWeek,
  FrequencyEnum,
} from '../Constants/createBatch.enums';
import { ValidationErrorConstants } from '../Constants/validation.error.constants';
import { BadRequestException, Injectable } from '@nestjs/common';


export class RecurringPatternDto {
  @IsDateString(
    {},
    {
      message:
        ValidationErrorConstants.CONST_ERROR_FROM_MUST_BE_STRING_DATE_TIME_FORMAT,
    },
  )
  @IsNotEmpty()
  from: string;

  @IsDateString(
    {},
    {
      message:
        ValidationErrorConstants.CONST_ERROR_FROM_MUST_BE_STRING_DATE_TIME_FORMAT,
    },
  )
  @IsNotEmpty()
  to: string;

  @IsInt()
  @IsEnum(IntervalEnum, {
    message: ValidationErrorConstants.CONST_ERROR_INTERVAL_MUST_BE_ENUM,
  })
  interval: number = IntervalEnum.Custom;

  @IsBoolean()
  @IsNotEmpty()
  neverEnd: boolean = false;

  @ValidateIf((object) => {
    if (!object.endAfterOccurrences) {
      return true;
    }
    return false;
  })
  @IsDateString(
    {},
    {
      message:
        ValidationErrorConstants.CONST_ERROR_FROM_MUST_BE_STRING_DATE_TIME_FORMAT,
    },
  )
  @IsOptional()
  endDate?: string;

  @ValidateIf((object, value) => {
    console.log(object.endDate);
    if (!object.endDate) {
      console.log(object.endDate);
      
      return true;
    }
    return false;
  })
  @IsInt({
    message:
      ValidationErrorConstants.CONST_ERROR_END_OCCURENCES_MUST_BE_FORM_MUST_BE_INTEGER,
  })
  endAfterOccurrences?: number;

  @IsInt()
  @Min(1)
  @IsEnum(FrequencyEnum, {
    message: ValidationErrorConstants.CONST_ERROR_FREQUENCY_MUST_BE_ENUM,
  })
  frequency: number;

  @IsInt()
  @Min(1, {
    message: ValidationErrorConstants.CONST_ERROR_REPEATEVERY_MUST_BE_INTEGER,
  })
  repeatEvery: number = 1;

  @ValidateIf((object, value) => {
    if (object.frequency === FrequencyEnum.WEEKS) {
      const validDayNumbers = Object.values(DayOfWeek);
      if (!Array.isArray(value)) {
        throw new BadRequestException('Value must be an array');
      } // Get an array of valid day numbers from your enum

      for (const dayNumber of value) {
        if (!validDayNumbers.includes(dayNumber)) {
          throw new BadRequestException(
            ValidationErrorConstants.CONST_ERROR_REPEATION_MUST_BE_FROM_ENUM,
          );
        }
      }
    }
    return true;
  })
  @IsEnum(DayOfWeek, {
    each: true,
    message:
      ValidationErrorConstants.CONST_ERROR_REPEAT_ON_MUST_BE_FROM_ENUM_DAY_OF_WEEK,
  })
  @IsArray()
  repeatOn: DayOfWeek[];
}
