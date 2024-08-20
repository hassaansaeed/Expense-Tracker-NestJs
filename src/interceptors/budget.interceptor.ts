import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BudgetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((budget) => this.transformBudget(budget));
        } else {
          return this.transformBudget(data);
        }
      }),
    );
  }

  private transformBudget(budget) {
    const {
      uuid,
      name,
      description,
      amount,
      start_date,
      end_date,
      createdAt,
      category_id,
    } = budget;
    const categoryName = budget.category_id?.name || null; // Assuming 'name' is a field in the Category

    return {
      uuid,
      name,
      description,
      amount,
      start_date,
      end_date,
      createdAt,
      category: categoryName,
    };
  }
}
