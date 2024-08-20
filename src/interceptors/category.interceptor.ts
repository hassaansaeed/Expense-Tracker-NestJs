import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((category) => this.transformCategory(category));
        } else {
          return this.transformCategory(data);
        }
      }),
    );
  }

  private transformCategory(category) {
    const { uuid, name, createdAt } = category;

    return {
      uuid,
      name,
      createdAt,
    };
  }
}
