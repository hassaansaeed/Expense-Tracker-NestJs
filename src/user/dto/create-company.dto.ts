import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
