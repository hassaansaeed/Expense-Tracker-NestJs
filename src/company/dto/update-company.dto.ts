import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  user_uuid?: string;
  users: [];
  uuid?: string;
}
