import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { IncomeModule } from './income/income.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/expense-tracker'),
    AuthModule,
    UserModule,
    ExpenseModule,
    CategoryModule,
    IncomeModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
