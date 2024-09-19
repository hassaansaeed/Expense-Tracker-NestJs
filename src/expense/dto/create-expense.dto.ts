import { IsNotEmpty, IsNumberString, ValidateIf } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  categoryUuid: string;

  @IsNotEmpty()
  budgetUuid: string;

  userUuid?: string;

  @ValidateIf((o) => o.userRole === 'company')
  @IsNotEmpty({ message: 'Company UUID is required for company role' })
  companyUuid: string;

  userRole: string; // New field for user role
}
