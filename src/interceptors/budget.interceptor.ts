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
      startDate,
      endDate,
      createdAt,
      categoryUuid,
    } = budget;
    const categoryName = budget.categoryUuid?.name || null;
    const categoryId = budget.categoryUuid?.uuid || null;

    return {
      uuid,
      name,
      description,
      amount,
      startDate,
      endDate,
      createdAt,
      categoryUuid: categoryId,

      category: categoryName,
    };
  }
}
