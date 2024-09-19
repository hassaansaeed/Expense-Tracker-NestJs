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
  categoryUuid: string;

  @IsOptional()
  budgetUuid: string;

  userUuid?: string;

  companyUuid?: string;
}
