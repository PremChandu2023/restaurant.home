import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'conditionalValidation', async: true })
  export class ConditionalValidation implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const { object } = args;
  
      if (value.recurring === false) {
        // If recurring is false, the 'to' date is required
        if (!value.to) {
          return false;
        }
        
        // If recurring is false, recurringPattern should not be passed or must be null
        if (value.recurringPattern !== null) {
          return false;
        }
      } else {
        // If recurring is true, enforce additional validation rules for recurringPattern here
        // For example, ensure certain fields within recurringPattern are required
      }
  
      return true;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Validation failed';
    }
  }
  