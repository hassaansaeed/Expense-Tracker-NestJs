import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from './income.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Income.name,
        schema: IncomeSchema,
      },
    ]),
  ],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
