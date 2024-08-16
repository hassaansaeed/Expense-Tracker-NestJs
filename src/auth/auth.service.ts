import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schems';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto) {
    const { firstName, lastName, email, password } = authSignUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const salat = await bcrypt.genSalt();
    const hashedPasswrd = await bcrypt.hash(password, salat);

    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPasswrd,
    });
    return newUser.save();
  }

  async login(authSignInDto: AuthSignUpDto) {
    const { email, password } = authSignInDto;
    const user = await this.userModel.findOne({ email });
    // console.log('user', user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
