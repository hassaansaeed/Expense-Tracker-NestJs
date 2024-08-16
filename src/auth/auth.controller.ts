import { Body, Controller, Post } from '@nestjs/common';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { User } from 'src/user/user.schems';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authSignUpDto: AuthSignUpDto): Promise<User> {
    return this.authService.signUp(authSignUpDto);
  }

  @Post('login')
  login(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.login(authSignInDto);
  }
}
