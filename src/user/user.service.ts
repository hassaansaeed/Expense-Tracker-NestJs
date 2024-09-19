import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schems';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

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

  async updateUser(updateUserDto: UpdateUserDto, id) {
    const { firstName, lastName, email, password } = updateUserDto;
    const find = this.userModel.findOne({ uuid: id });
    if (find) {
      throw new NotFoundException('user not found');
    } else {
      console.log('testup', find);
      return 'test';
    }
  }
}
