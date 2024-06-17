import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassType<T> = new () => T;

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        let response = null;
        if (Array.isArray(data)) {
          response = data.map((item) => plainToClass(this.classType, item));
        } else {
          response = plainToClass(this.classType, data);
        }

        return response;
      }),
    );
  }
}
