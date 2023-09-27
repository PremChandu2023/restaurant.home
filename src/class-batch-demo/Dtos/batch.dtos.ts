import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CompareOperator,
  DayOfWeek,
  DiscountTypeEnum,
  EligibiltyKey,
  IntervalEnum,
} from '../Enums/createBatch.enums';
import { Type } from 'class-transformer';

// export class ApplicableBatchIdsDto {
//   batchIds: number[];
// }

// export class PlansSchemaDto {
//   @IsString()
//   title: string;

//   @ValidateNested()
//   @Type(() => ApplicableBatchIdsDto)
//   applicableBatchIds: ApplicableBatchIdsDto[];

//   @IsEnum(DiscountTypeEnum, {
//     message: 'Discount type must be one of: flat, percentage',
//   })
//   discountType: string;

//   @IsNumber({}, { message: 'discountValue must be a valid number' })
//   discountValue: number;
// }

// export class EligibilityCriteriaDto {
//   @IsString()
//   @IsEnum(EligibiltyKey, {
//     each: true,
//     message: 'It should be either age or gender',
//   })
//   key: string;

//   @IsString()
//   @IsEnum(CompareOperator, {
//     each: true,
//     message: 'It should be either equals, not_equals, greater_than, less_than',
//   })
//   compareOperator: CompareOperator;

//   @IsString()
//   value: string;
// }

// export class RecurringPatternDto {
//   @IsDateString()
//   from: string;

//   @IsDateString()
//   to:string;

//   @IsInt()
//   @IsEnum(IntervalEnum, {
//     message: 'Interval must be 1.EveryDay 2.Everyweek 3.Custom',
//   })
//   interval: number;

//   @IsBoolean()
//   neverEnd: boolean = false;

//   @IsDateString()
//   @IsOptional()
//   endDate?: string;

//   @IsInt({
//     each: true,
//     message: 'endAfterOccurrences must be an integer or null',
//   })
//   @IsOptional()
//   @IsInt()
//   endAfterOccurrences?: number | null;

//   @IsInt()
//   @Min(1)
//   frequency: number;

//   @IsInt()
//   repeatEvery: number = 1;

//   @IsEnum(DayOfWeek, {
//     each: true,
//     message: 'repeatOn must be an array of valid day numbers',
//   })
//   @IsArray()
//   repeatOn: DayOfWeek[];
// }

// export class CreateBatchDto {
//   @IsInt()
//   @IsNotEmpty()
//   termId: number;

//   @IsNotEmpty()
//   @MaxLength(20, { message: 'Batch Code  length must be less than 20 ' })
//   batchCode: string;

//   @IsNotEmpty()
//   @MaxLength(50, { message: 'Title length must be less than 50' })
//   title: string;

//   @IsString()
//   description: string;

//   @IsInt()
//   instructor: number;

//   @IsNumber()
//   @Min(0.01)
//   feePerClass: number;

//   @IsInt()
//   @Min(1)
//   maxCapacity: number;

//   @IsBoolean()
//   recurring: boolean = true;

//   @IsDateString()
//   from: string;

//   @IsDateString()
//   to?: string;

//   @ValidateNested()
  
//   @Type(() => RecurringPatternDto)
//   recurringPattern: RecurringPatternDto;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => EligibilityCriteriaDto)
//   eligibilityCriteria: EligibilityCriteriaDto[];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => PlansSchemaDto)
//   plans: PlansSchemaDto[];
// }
