import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'Start Date must be a valid date in DD-MM-YYYY format' })
  start_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'End Date must be a valid date in DD-MM-YYYY format' })
  end_date: Date;

  @IsNotEmpty()
  category_id: string;

  user_id?: string;
}
