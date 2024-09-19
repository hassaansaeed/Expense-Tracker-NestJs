import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSignUpDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role?: string;
}

// import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// export class AuthCredentialsDto {
//   @IsString()
//   @MinLength(8)
//   @MaxLength(20)
//   username: string;

//   @IsString()
//   @MinLength(8)
//   @MaxLength(32)
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//     message: 'Password is too weak',
//   })
//   password: string;
// }
