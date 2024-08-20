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
    const { name, uuid, amount, createdAt, category_id } = expense;
    const categoryName = expense.category_id?.name || null; // Assuming 'name' is a field in the Category

    return {
      name,
      uuid,
      amount,
      createdAt,
      category: categoryName,
    };
  }
}
