import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expense.schema';
import { CustomRequest } from 'src/request-interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  expenses(@Req() req: CustomRequest): Promise<Expense[]> {
    const user_id = req.user.uuid;
    return this.expenseService.expenses(user_id);
  }

  @Get('/:id')
  expense(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ): Promise<Expense> {
    const user_id = req.user.uuid;
    return this.expenseService.expense(id, user_id);
  }

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: CustomRequest,
  ): Promise<Expense> {
    createExpenseDto.user_id = req.user.uuid;
    return this.expenseService.create(createExpenseDto);
  }

  @Put('/:id')
  update(
    @Body() CreateExpenseDto: CreateExpenseDto,
    @Req() req: CustomRequest,
    @Param('id') id: string,
  ) {
    CreateExpenseDto.user_id = req.user.uuid;
    return this.expenseService.update(id, CreateExpenseDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: CustomRequest) {
    const user_id = req.user.uuid;
    return this.expenseService.delete(id, user_id);
  }
}
