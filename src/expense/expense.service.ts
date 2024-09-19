import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';
import { Model } from 'mongoose';
import { Expense } from './expense.schema';
import { retry } from 'rxjs';
import { Budget } from 'src/budget/budget.schema';
import { PopulateUtils } from 'src/utils/populate.utils';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
  ) {}

  async expenses(userUuid): Promise<Expense[]> {
    return this.expenseModel
      .find({ userUuid: userUuid })
      .populate(PopulateUtils.populateCategory())
      .populate(PopulateUtils.populateBudget())
      .exec();
  }

  async expense(id, userUuid): Promise<Expense> {
    return this.expenseModel
      .findOne({ uuid: id, userUuid: userUuid })
      .populate(PopulateUtils.populateCategory())
      .populate(PopulateUtils.populateBudget())
      .exec();
  }

  async create(createExpenseDto: CreateExpenseDto) {
    const [category, budget] = await Promise.all([
      this.categoryModel.findOne({ uuid: createExpenseDto.categoryUuid }),
      this.budgetModel.findOne({ uuid: createExpenseDto.budgetUuid }),
    ]);

    if (!category || !budget) {
      throw new NotFoundException('Category or budget not found');
    }

    return this.expenseModel.create(createExpenseDto);
  }

  async update(id, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const { categoryUuid, budgetUuid, name, amount, userUuid, companyUuid } =
      createExpenseDto;

    const [category, expense] = await Promise.all([
      this.categoryModel.findOne({ uuid: categoryUuid }),
      this.expenseModel.findOne({ uuid: id }),
    ]);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (!category) {
      throw new NotFoundException('category not found');
    }
    if (expense.userUuid != userUuid) {
      throw new ForbiddenException(
        'you do not have permission to edit this expense',
      );
    }

    if (createExpenseDto.companyUuid) {
      expense.companyUuid = companyUuid;
    }

    expense.name = name;
    expense.amount = amount;
    expense.categoryUuid = categoryUuid;
    expense.budgetUuid = budgetUuid;
    return expense.save();
  }

  async delete(id, userUuid) {
    const expense = await this.expenseModel.findOne({ uuid: id });
    if (!expense) {
      throw new NotFoundException('expense not found');
    }
    if (expense.userUuid != userUuid) {
      throw new ForbiddenException(
        'You do not have permission to delete this expense',
      );
    }
    return expense.deleteOne();
  }
}
