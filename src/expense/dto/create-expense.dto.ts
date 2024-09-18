import { IsNotEmpty, IsNumberString, ValidateIf } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  budget_id: string;

  user_id?: string;

  @ValidateIf((o) => o.userRole === 'company')
  @IsNotEmpty({ message: 'Company UUID is required for company role' })
  company_uuid: string;

  userRole: string; // New field for user role
}
