import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumberString()
  amount: string;

  @IsOptional()
  @IsNotEmpty()
  category_id: string;

  @IsOptional()
  budget_id: string;

  user_id?: string;

  company_uuid?: string;
}
