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

  async expenses(user_id): Promise<Expense[]> {
    return this.expenseModel
      .find({ user_id: user_id })
      .populate(PopulateUtils.populateCategory())
      .populate(PopulateUtils.populateBudget())
      .exec();
  }

  async expense(id, user_id): Promise<Expense> {
    return this.expenseModel
      .findOne({ uuid: id, user_id: user_id })
      .populate(PopulateUtils.populateCategory())
      .populate(PopulateUtils.populateBudget())
      .exec();
  }

  async create(createExpenseDto: CreateExpenseDto) {
    const [category, budget] = await Promise.all([
      this.categoryModel.findOne({ uuid: createExpenseDto.category_id }),
      this.budgetModel.findOne({ uuid: createExpenseDto.budget_id }),
    ]);

    if (!category || !budget) {
      throw new NotFoundException('Category or budget not found');
    }

    return this.expenseModel.create(createExpenseDto);
  }

  async update(id, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const { category_id, budget_id, name, amount, user_id, company_uuid } =
      createExpenseDto;

    const [category, expense] = await Promise.all([
      this.categoryModel.findOne({ uuid: category_id }),
      this.expenseModel.findOne({ uuid: id }),
    ]);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (!category) {
      throw new NotFoundException('category not found');
    }
    if (expense.user_id != user_id) {
      throw new ForbiddenException(
        'you do not have permission to edit this expense',
      );
    }

    if (createExpenseDto.company_uuid) {
      expense.company_uuid = company_uuid;
    }

    expense.name = name;
    expense.amount = amount;
    expense.category_id = category_id;
    expense.budget_id = budget_id;
    return expense.save();
  }

  async delete(id, user_id) {
    const expense = await this.expenseModel.findOne({ uuid: id });
    if (!expense) {
      throw new NotFoundException('expense not found');
    }
    if (expense.user_id != user_id) {
      throw new ForbiddenException(
        'You do not have permission to delete this expense',
      );
    }
    return expense.deleteOne();
  }
}
