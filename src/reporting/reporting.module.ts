import { Module } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { Income, IncomeSchema } from 'src/income/income.schema';
import { Expense, ExpenseSchema } from 'src/expense/expense.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
