import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from '../expense/expense.schema';
import { Income } from '../income/income.schema';
import { PopulateUtils } from 'src/utils/populate.utils';
import { Budget } from 'src/budget/budget.schema';

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
  ) {}

  private getDefaultDateRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = now;
    return { start, end };
  }

  async getExpensesDetail(
    userUuid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Expense[]> {
    const { start, end } =
      startDate && endDate
        ? { start: startDate, end: endDate }
        : this.getDefaultDateRange();

    return this.expenseModel
      .find({
        userUuid: userUuid,
        createdAt: { $gte: start, $lte: end },
      })
      .populate(PopulateUtils.populateCategory())
      .populate(PopulateUtils.populateBudget())
      .exec();
  }

  // Get total income for a given period
  async getTotalIncome(
    userUuid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Array<{ uuid: string; name: string; amount: number }>> {
    const { start, end } =
      startDate && endDate
        ? { start: startDate, end: endDate }
        : this.getDefaultDateRange();

    const result = await this.incomeModel.aggregate([
      {
        $match: {
          userUuid: userUuid,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            uuid: '$uuid',
            name: '$name',
          },
          amount: { $sum: { $toDouble: '$amount' } },
        },
      },
      {
        $project: {
          _id: 0,
          uuid: '$_id.uuid',
          name: '$_id.name',
          amount: 1,
        },
      },
    ]);

    return result;
  }

  // Get category-wise breakdown of expenses
  async getCategoryWiseExpenses(
    userUuid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const { start, end } =
      startDate && endDate
        ? { start: startDate, end: endDate }
        : this.getDefaultDateRange();

    return this.expenseModel.aggregate([
      {
        $match: {
          userUuid: userUuid,
          createdAt: { $gte: start, $lte: end },
        },
      },
      PopulateUtils.lookupCategory(),
      {
        $unwind: '$categoryDetails',
      },
      {
        $group: {
          _id: {
            uuid: '$categoryDetails.uuid',
            name: '$categoryDetails.name',
          },
          total: { $sum: { $toDouble: '$amount' } },
        },
      },
      {
        $project: {
          _id: 0,
          category_uuid: '$_id.uuid',
          category_name: '$_id.name',
          total: 1,
        },
      },
    ]);
  }

  async getBudgetExpenseWise(
    userUuid: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    // Default to the start and end of the current month if no dates are provided
    const { start, end } =
      startDate && endDate
        ? { start: startDate, end: endDate }
        : this.getDefaultDateRange();

    const budgets = await this.budgetModel
      .find({
        userUuid: userUuid,
        startDate: { $lte: end },
        endDate: { $gte: start },
      })
      .lean();

    const expenses = await this.expenseModel
      .find({
        userUuid: userUuid,

        createdAt: { $gte: start, $lte: end },
      })
      .lean();

    return budgets.map((budget) => {
      const spentAmount = expenses
        .filter((expense) => expense.budgetUuid === budget.uuid)
        .reduce((total, expense) => total + parseFloat(expense.amount), 0);

      return {
        ...budget,
        spentAmount,
        remainingAmount: parseFloat(budget.amount) - spentAmount,
      };
    });
  }

  // Get category-wise breakdown of income
  async getCategoryWiseIncome(
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const { start, end } =
      startDate && endDate
        ? { start: startDate, end: endDate }
        : this.getDefaultDateRange();

    return this.incomeModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: { $toDouble: '$amount' } },
        },
      },
    ]);
  }
}
