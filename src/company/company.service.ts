import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from 'src/user/user.schems';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async companies(user_uuid, uuid): Promise<Company[]> {
    if (uuid) {
      return this.companyModel.findOne({
        user_uuid: user_uuid,
        uuid: uuid,
      });
    } else {
      return this.companyModel
        .find({
          user_uuid: user_uuid,
        })
        .exec();
    }
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyModel.create(createCompanyDto);
  }

  async usersToAdd(user_uuid, company_uuid) {
    const company = await this.companyModel.findOne({
      user_uuid: user_uuid,
      uuid: company_uuid,
    });
    if (!company) {
      throw new NotFoundException('A company must be selected to get users.');
    }

    return await this.userModel
      .find({ role: 'user', company_uuid: null })
      .exec();
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyModel.findOne({
      uuid: updateCompanyDto.uuid,
    });

    if (!company) {
      throw new Error('Company not found');
    }
    company.name = updateCompanyDto.name;
    company.address = updateCompanyDto.address;
    await Promise.all(
      updateCompanyDto.users.map(async (userUuid: string) => {
        await this.userModel.findOneAndUpdate(
          { uuid: userUuid },
          { company_uuid: company.uuid },
        );
      }),
    );

    await company.save();

    // Return the updated company and optionally some status for the updated users
    return {
      message: 'Company and users updated successfully',
      company,
    };
  }
}
