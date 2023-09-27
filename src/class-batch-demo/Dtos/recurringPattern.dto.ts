import { IsDateString, IsInt, IsEnum, IsBoolean, IsOptional, Min, IsArray } from "class-validator";
import { IntervalEnum, DayOfWeek, FrequencyEnum } from "../Enums/createBatch.enums";

export class RecurringPatternDto {
    @IsDateString()
    from: string;
  
    @IsDateString()
    to:string;
  
    @IsInt()
    @IsEnum(IntervalEnum, {
      message: 'Interval must be 1.EveryDay 2.Everyweek 3.Custom',
    })
    interval: number;
  
    @IsBoolean()
    neverEnd: boolean = false;
  
    @IsDateString()
    @IsOptional()
    endDate?: string;
  
    @IsInt({
      each: true,
      message: 'endAfterOccurrences must be an integer or null',
    })
    @IsOptional()
    @IsInt()
    endAfterOccurrences?: number | null;
  
    @IsInt()
    @Min(1)
    @IsEnum(FrequencyEnum)
    frequency: number;
  
    @IsInt()
    @Min(1)
    repeatEvery: number = 1;
  
    @IsEnum(DayOfWeek, {
      each: true,
      message: 'repeatOn must be an array of valid day numbers',
    })
    @IsArray()
    repeatOn: DayOfWeek[];
  }