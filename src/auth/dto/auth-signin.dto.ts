import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthSignInDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
