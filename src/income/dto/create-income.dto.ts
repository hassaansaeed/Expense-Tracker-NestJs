import {
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Currency } from '../currence-enum';
import { Transform, Type } from 'class-transformer';

export class CreateIncomeDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  source: string;

  @IsNotEmpty()
  @IsEnum(Currency, {
    message: 'Currency must be a valid value: PKR, USD, EUR, etc.',
  })
  currency: Currency;

  @IsNotEmpty()
  @Type(() => Date) // Transform the string to a Date object
  @IsDate({ message: 'Date must be a valid date in DD-MM-YYYY format' })
  date: Date;

  user_id?: string;
}
