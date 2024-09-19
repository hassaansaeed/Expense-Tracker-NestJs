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
import { ReportingModule } from './reporting/reporting.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/expense-tracker'),

    // Atlas Database
    // MongooseModule.forRoot(
    //   'mongodb+srv://creativedev45:9cdgVvuLNodHUqVU@jig3.nasm49a.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=jig3',
    // ),
    AuthModule,
    UserModule,
    ExpenseModule,
    CategoryModule,
    IncomeModule,
    BudgetModule,
    ReportingModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
