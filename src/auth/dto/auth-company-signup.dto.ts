import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthCompanySignUpDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role?: string;
}
