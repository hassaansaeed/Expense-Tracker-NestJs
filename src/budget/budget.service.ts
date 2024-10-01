import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Category } from 'src/category/category.schema';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PopulateUtils } from 'src/utils/populate.utils';
import { Income } from 'src/income/income.schema';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Income.name) private incomeModel: Model<Income>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const category = await this.categoryModel.findOne({
      uuid: createBudgetDto.categoryUuid,
    });
    if (!category) {
      throw new NotFoundException(
        'Category Not Found. Please select a category to add budget',
      );
    }

    const totalIncome = await this.incomeModel.aggregate([
      {
        $match: {
          userUuid: createBudgetDto.userUuid,
          date: {
            $gte: new Date(createBudgetDto.startDate),
            $lte: new Date(createBudgetDto.endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalIncomeAmount = totalIncome[0]?.totalAmount || 0;
    const existingBudgets = await this.budgetModel.aggregate([
      {
        $match: {
          userUuid: createBudgetDto.userUuid,
          $or: [
            {
              startDate: { $lte: new Date(createBudgetDto.endDate) },
              endDate: { $gte: new Date(createBudgetDto.startDate) },
            },
            {
              startDate: { $gte: new Date(createBudgetDto.startDate) },
              endDate: { $lte: new Date(createBudgetDto.endDate) },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalBudgetAmount: { $sum: { $toDouble: '$amount' } },
        },
      },
    ]);

    const existingTotalBudgetAmount =
      existingBudgets[0]?.totalBudgetAmount || 0;
    const proposedTotalBudgetAmount =
      parseInt(existingTotalBudgetAmount) + parseInt(createBudgetDto.amount);

    const remainingIncome: number =
      totalIncomeAmount - existingTotalBudgetAmount;
    console.log('proposedTotalBudgetAmount', proposedTotalBudgetAmount);
    if (proposedTotalBudgetAmount > totalIncomeAmount) {
      throw new BadRequestException(
        `Budget amount (${createBudgetDto.amount}) exceeds the remaining income for the specified period. ` +
          `Existing budgets: ${existingTotalBudgetAmount}, Total income: ${totalIncomeAmount} you can add maximum of ${remainingIncome}.`,
      );
    }

    return this.budgetModel.create(createBudgetDto);
  }

  async budgets(userUuid, id?: string): Promise<Budget | Budget[]> {
    if (id) {
      return this.budgetModel
        .findOne({
          uuid: id,
          userUuid: userUuid,
        })
        .populate(PopulateUtils.populateCategory())
        .exec();
    } else {
      return this.budgetModel
        .find({
          userUuid: userUuid,
        })
        .populate(PopulateUtils.populateCategory())
        .exec();
    }
  }

  async update(updateBudgetDto: UpdateBudgetDto) {
    // Check if the category exists
    const category = await this.categoryModel.findOne({
      uuid: updateBudgetDto.categoryUuid,
    });
    if (!category) {
      throw new NotFoundException(
        'Category Not Found. Please select a valid category to update the budget.',
      );
    }

    // Calculate total income for the specified date range
    const totalIncome = await this.incomeModel.aggregate([
      {
        $match: {
          userUuid: updateBudgetDto.userUuid,
          date: {
            $gte: new Date(updateBudgetDto.startDate),
            $lte: new Date(updateBudgetDto.endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalIncomeAmount = totalIncome[0]?.totalAmount || 0;

    // Get existing budgets within the specified date range, excluding the current budget
    const existingBudgets = await this.budgetModel.aggregate([
      {
        $match: {
          userUuid: updateBudgetDto.userUuid,
          uuid: { $ne: updateBudgetDto.id }, // Exclude the current budget from calculation
          $or: [
            {
              startDate: { $lte: new Date(updateBudgetDto.endDate) },
              endDate: { $gte: new Date(updateBudgetDto.startDate) },
            },
            {
              startDate: { $gte: new Date(updateBudgetDto.startDate) },
              endDate: { $lte: new Date(updateBudgetDto.endDate) },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalBudgetAmount: { $sum: { $toDouble: '$amount' } },
        },
      },
    ]);

    const existingTotalBudgetAmount =
      existingBudgets[0]?.totalBudgetAmount || 0;
    const proposedTotalBudgetAmount =
      parseInt(existingTotalBudgetAmount) + parseInt(updateBudgetDto.amount);
    const remainingIncome: number =
      totalIncomeAmount - existingTotalBudgetAmount;

    console.log('proposedTotalBudgetAmount', proposedTotalBudgetAmount);
    if (proposedTotalBudgetAmount > totalIncomeAmount) {
      throw new BadRequestException(
        `Budget amount (${updateBudgetDto.amount}) exceeds the remaining income for the specified period. ` +
          `Existing budgets: ${existingTotalBudgetAmount}, Total income: ${totalIncomeAmount}. You can add a maximum of ${remainingIncome}.`,
      );
    }

    // Update the budget
    const budget = await this.budgetModel
      .findOneAndUpdate(
        {
          uuid: updateBudgetDto.id,
          userUuid: updateBudgetDto.userUuid,
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
        `Budget with id ${updateBudgetDto.id} not found or access denied.`,
      );
    }

    return budget;
  }

  async delete(userUuid, id: string) {
    const budget = await this.budgetModel.findOne({
      uuid: id,
      userUuid: userUuid,
    });

    if (!budget) {
      throw new NotFoundException(
        `Budget with id ${id} not found or access denied`,
      );
    }

    return budget.deleteOne();
  }
}
