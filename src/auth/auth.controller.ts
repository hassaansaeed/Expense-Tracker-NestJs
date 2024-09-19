import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { User } from 'src/user/user.schems';
import { AuthGuard } from '@nestjs/passport';
import { AuthCompanySignUpDto } from './dto/auth-company-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('validate-token')
  @UseGuards(AuthGuard('jwt'))
  validateToken() {
    return { valid: true };
  }

  @Post('/signup')
  signUp(
    @Body() authSignUpDto: AuthSignUpDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signUp(authSignUpDto);
  }

  @Post('/company-signup')
  companySignUp(
    @Body() authCompanySignUpDto: AuthCompanySignUpDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.comapnySignUp(authCompanySignUpDto);
  }

  @Post('login')
  login(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.login(authSignInDto);
  }
}
