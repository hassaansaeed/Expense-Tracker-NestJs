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

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async expenses(user_id): Promise<Expense[]> {
    return this.expenseModel.find({ user_id: user_id });
  }

  async expense(id, user_id): Promise<Expense> {
    return this.expenseModel.findOne({ uuid: id, user_id: user_id });
  }

  async create(createExpenseDto: CreateExpenseDto) {
    const { category_id, name, amount, user_id } = createExpenseDto;
    const category = await this.categoryModel.findOne({ uuid: category_id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.expenseModel.create({
      name,
      amount,
      category_id: category.uuid,
      user_id: user_id,
    });
  }

  async update(id, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const { category_id, name, amount, user_id } = createExpenseDto;

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

    expense.name = name;
    expense.amount = amount;
    expense.category_id = category_id;
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
