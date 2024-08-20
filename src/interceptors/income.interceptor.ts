import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class IncomeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((income) => this.transformIncome(income));
        } else {
          return this.transformIncome(data);
        }
      }),
    );
  }

  private transformIncome(income) {
    const {
      uuid,
      name,
      description,
      amount,
      date,
      currency,
      source,
      createdAt,
    } = income;

    return {
      uuid,
      name,
      description,
      amount,
      date,
      currency,
      source,
      createdAt,
    };
  }
}
