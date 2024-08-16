import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  category_id: string;

  user_id?: string;
}
