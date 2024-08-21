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
    const { uuid, name, amount, createdAt, category_id, budget_id } = expense;
    const categoryName = expense.category_id?.name || null;
    // console.log(expense);

    return {
      uuid,
      name,
      amount,
      createdAt,
      category: categoryName,
      category_id: expense.category_id.uuid,
      budget_id: expense.budget_id.uuid,
      budget_name: expense.budget_id.name,
    };
  }
}
