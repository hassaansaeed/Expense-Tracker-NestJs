import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Category } from 'src/category/category.schema';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PopulateUtils } from 'src/utils/populate.utils';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const category = await this.categoryModel.findOne({
      uuid: createBudgetDto.category_id,
    });
    if (!category) {
      throw new NotFoundException(
        'Category Not Found Please select a category to add budget',
      );
    }
    return this.budgetModel.create(createBudgetDto);
  }

  async budgets(user_id, id?: string): Promise<Budget | Budget[]> {
    if (id) {
      return this.budgetModel
        .findOne({
          uuid: id,
          user_id: user_id,
        })
        .populate(PopulateUtils.populateCategory())
        .exec();
    } else {
      return this.budgetModel
        .find({
          user_id: user_id,
        })
        .populate(PopulateUtils.populateCategory())
        .exec();
    }
  }

  async update(updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.budgetModel
      .findOneAndUpdate(
        {
          uuid: updateBudgetDto.id,
          user_id: updateBudgetDto.user_id,
        },
        updateBudgetDto,

        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!budget) {
      throw new NotFoundException(
        `Budget with ${updateBudgetDto.id} not found or access denied`,
      );
    }
    return budget;
  }

  async delete(user_id, id: string) {
    const budget = await this.budgetModel.findOne({
      uuid: id,
      user_id: user_id,
    });

    if (!budget) {
      throw new NotFoundException(
        `Budget with id ${id} not found or access denied`,
      );
    }

    return budget.deleteOne();
  }
}
