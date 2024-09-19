import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { Expense } from 'src/expense/expense.schema';
import { Income } from 'src/income/income.schema';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/request-interface';
import { ExpenseInterceptor } from 'src/interceptors/expense.interceptor';

@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('expenses/total')
  @UseInterceptors(ExpenseInterceptor)
  async getExpensesDetail(
    @Req() req: CustomRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Expense[]> {
    const userUuid = req.user.uuid;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportingService.getExpensesDetail(userUuid, start, end);
  }

  @Get('income/source-wise')
  async getTotalIncome(
    @Req() req: CustomRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Array<{ uuid: string; name: string; amount: number }>> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const userUuid = req.user.uuid;

    return this.reportingService.getTotalIncome(userUuid, start, end);
  }

  @Get('expenses/category-wise')
  async getCategoryWiseExpenses(
    @Req() req: CustomRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const userUuid = req.user.uuid;
    return this.reportingService.getCategoryWiseExpenses(userUuid, start, end);
  }

  @Get('budget/expense-wise')
  async getBudgetsWithExpenses(
    @Req() req: CustomRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const userUuid = req.user.uuid;
    return this.reportingService.getBudgetExpenseWise(userUuid, start, end);
  }

  @Get('income/category-wise')
  async getCategoryWiseIncome(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportingService.getCategoryWiseIncome(start, end);
  }
}
