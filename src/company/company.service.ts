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
    const { name, address, user_uuid } = createCompanyDto;
    console.log(user_uuid);
    // return;
    return this.companyModel.create({
      name,
      address,
      user_uuid,
    });
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
      .find({
        role: 'user',
        $or: [{ company_uuid: null }, { company_uuid: company_uuid }],
      })
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

    await this.userModel.updateMany(
      { company_uuid: company.uuid },
      { company_uuid: null },
    );

    if (updateCompanyDto.users?.length > 0) {
      await Promise.all(
        updateCompanyDto.users.map(async (userUuid: string) => {
          await this.userModel.findOneAndUpdate(
            { uuid: userUuid },
            { company_uuid: company.uuid },
          );
        }),
      );
    }

    await company.save();

    return {
      message: 'Company and users updated successfully',
      company,
    };
  }
}
