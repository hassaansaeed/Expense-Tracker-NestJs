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
import { AuthCompanySignUpDto } from './dto/auth-company-signup.dto';
import { Company } from 'src/company/company.schema';
import { Mode } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authSignUpDto: AuthSignUpDto,
  ): Promise<{ user: User; accessToken: string }> {
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
    const savedUser = await newUser.save();
    const payload = { email: savedUser.email, sub: savedUser._id }; // sub is usually the user ID
    const accessToken = this.jwtService.sign(payload);
    return {
      user: savedUser,
      accessToken,
    };
  }

  async comapnySignUp(
    authCompanySignUpDto: AuthCompanySignUpDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { firstName, lastName, email, password, companyName, address } =
      authCompanySignUpDto;

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
      role: 'company',
    });
    const savedUser = await newUser.save();

    this.companyModel.create({
      name: companyName,
      address: address,
      user_uuid: savedUser.uuid,
    });

    const payload = { email: savedUser.email, sub: savedUser._id };
    const accessToken = this.jwtService.sign(payload);
    return {
      user: savedUser,
      accessToken,
    };
  }

  async login(authSignInDto: AuthSignUpDto) {
    const { email, password } = authSignInDto;
    const user = await this.userModel.findOne({ email });
    // console.log('user', user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken, user };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
