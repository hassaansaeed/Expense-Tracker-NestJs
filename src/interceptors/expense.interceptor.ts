import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExpenseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((expense) => this.transformExpense(expense));
        } else {
          return this.transformExpense(data);
        }
      }),
    );
  }

  private transformExpense(expense) {
    const {
      uuid,
      name,
      amount,
      createdAt,
      categoryUuid,
      budgetUuid,
      companyUuid,
    } = expense;
    const categoryName = expense.categoryUuid?.name || null;

    return {
      uuid,
      name,
      amount,
      createdAt,
      category: categoryName,
      categoryUuid: expense.categoryUuid.uuid,
      budgetUuid: expense.budgetUuid.uuid,
      budget_name: expense.budgetUuid.name,
      companyUuid,
    };
  }
}
