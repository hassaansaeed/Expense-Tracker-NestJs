import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './income.schema';
import { Model } from 'mongoose';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PopulateUtils } from 'src/utils/populate.utils';

@Injectable()
export class IncomeService {
  constructor(@InjectModel(Income.name) private incomeModel: Model<Income>) {}

  async incomes(userUuid: string, id?): Promise<Income | Income[]> {
    if (id) {
      return this.incomeModel.findOne({ uuid: id });
    } else {
      return this.incomeModel.find({ userUuid: userUuid });
    }
  }

  async create(createIncomeDto: CreateIncomeDto) {
    return this.incomeModel.create(createIncomeDto);
  }

  async update(updateIncomeDto: UpdateIncomeDto, id: string): Promise<Income> {
    const updatedIncome = await this.incomeModel
      .findOneAndUpdate(
        { uuid: id, userUuid: updateIncomeDto.userUuid },
        updateIncomeDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!updatedIncome) {
      throw new NotFoundException(
        `Income with id ${id} not found or access denied`,
      );
    }

    return updatedIncome;
  }

  async delete(userUuid, id: string) {
    const income = await this.incomeModel.findOne({
      uuid: id,
      userUuid: userUuid,
    });
    if (!income) {
      throw new NotFoundException(
        `Income with id ${id} not found or access denied`,
      );
    }

    return income.deleteOne();
  }
}
