import { Controller, Get, Query } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { Expense } from 'src/expense/expense.schema';
import { Income } from 'src/income/income.schema';

@Controller('report')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('expenses/total')
  async getTotalExpenses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<number> {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return this.reportingService.getTotalExpenses(start, end);
  }

  @Get('income/source-wise')
  async getTotalIncome(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Array<{ uuid: string; name: string; amount: number }>> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportingService.getTotalIncome(start, end);
  }

  @Get('expenses/category-wise')
  async getCategoryWiseExpenses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportingService.getCategoryWiseExpenses(start, end);
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
