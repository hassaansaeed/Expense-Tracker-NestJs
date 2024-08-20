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

  async incomes(user_id: string, id?): Promise<Income | Income[]> {
    if (id) {
      return this.incomeModel.findOne({ uuid: id });
    } else {
      return this.incomeModel.find({ user_id: user_id });
    }
  }

  async create(createIncomeDto: CreateIncomeDto) {
    return this.incomeModel.create(createIncomeDto);
  }

  async update(updateIncomeDto: UpdateIncomeDto, id: string): Promise<Income> {
    const updatedIncome = await this.incomeModel
      .findOneAndUpdate(
        { uuid: id, user_id: updateIncomeDto.user_id },
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

  async delete(user_id, id: string) {
    const income = await this.incomeModel.findOne({
      uuid: id,
      user_id: user_id,
    });
    if (!income) {
      throw new NotFoundException(
        `Income with id ${id} not found or access denied`,
      );
    }

    return income.deleteOne();
  }
}
