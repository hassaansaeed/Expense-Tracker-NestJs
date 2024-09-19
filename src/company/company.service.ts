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

  async companies(userUuid, uuid): Promise<Company[]> {
    if (uuid) {
      return this.companyModel.findOne({
        userUuid: userUuid,
        uuid: uuid,
      });
    } else {
      return this.companyModel
        .find({
          userUuid: userUuid,
        })
        .exec();
    }
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name, address, userUuid } = createCompanyDto;
    console.log(userUuid);
    // return;
    return this.companyModel.create({
      name,
      address,
      userUuid,
    });
  }

  async usersToAdd(userUuid, companyUuid) {
    const company = await this.companyModel.findOne({
      userUuid: userUuid,
      uuid: companyUuid,
    });

    if (!company) {
      throw new NotFoundException('A company must be selected to get users.');
    }
    return await this.userModel
      .find({
        role: 'user',
        $or: [{ companyUuid: null }, { companyUuid: companyUuid }],
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
      { companyUuid: company.uuid },
      { companyUuid: null },
    );

    if (updateCompanyDto.users?.length > 0) {
      await Promise.all(
        updateCompanyDto.users.map(async (userUuid: string) => {
          await this.userModel.findOneAndUpdate(
            { uuid: userUuid },
            { companyUuid: company.uuid },
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
