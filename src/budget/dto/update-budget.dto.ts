import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumberString()
  amount: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Start Date must be a valid date in DD-MM-YYYY format' })
  start_date: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End Date must be a valid date in DD-MM-YYYY format' })
  end_date: Date;

  @IsOptional()
  category_id: string;

  user_id?: string;

  id?: string;
}
