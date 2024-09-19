import {
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Currency } from '../currence-enum';
import { Type } from 'class-transformer';

export class UpdateIncomeDto {
  @IsOptional() // Make this field optional for updates
  @IsNotEmpty({ message: 'Name must not be empty' })
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Amount must not be empty' })
  @IsNumberString()
  amount?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Source must not be empty' })
  source?: string;

  @IsOptional()
  @IsEnum(Currency, {
    message: 'Currency must be a valid value: PKR, USD, EUR, etc.',
  })
  currency?: Currency;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date in DD-MM-YYYY format' })
  date?: Date;

  userUuid?: string;
}
