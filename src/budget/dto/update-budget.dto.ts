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
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End Date must be a valid date in DD-MM-YYYY format' })
  endDate: Date;

  @IsOptional()
  categoryUuid: string;

  userUuid?: string;

  companyUuid?: string;

  id?: string;
}
