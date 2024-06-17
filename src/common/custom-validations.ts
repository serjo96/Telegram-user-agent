import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Ваши текущие функции для форматирования ошибок
type ErrorObject = {
  [key: string]: any;
};

export interface ErrorData {
  messages: string[];
  nested?: ErrorData;
}

const formattedErrors = (error: ValidationError[]) => {
  return error.reduce((acc, error) => {
    const messages = Object.values(error.constraints);
    acc[error.property] = {
      value: error.value,
      messages,
    };

    if (error.children && error.children.length) {
      acc[error.property].nested = formattedErrors(error.children);
    }
    return acc;
  }, {} as ErrorObject);
};

export function formatErrors(errors: ValidationError[]) {
  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    errors: formattedErrors(errors),
    error: 'Validation Error',
  });
}

export enum ValidationOptions {
  SKIP = 'SKIP',
}


@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  constructor(private readonly reflector: Reflector) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // Получаем метаданные для текущего эндпоинта
    const validationOption = this.reflector.get<ValidationOptions>(
      'validationOption',
      metadata.metatype,
    );

    if (validationOption === ValidationOptions.SKIP) {
      return value;
    }

    // Используем встроенный ValidationPipe для остальных эндпоинтов
    const validationPipe = new ValidationPipe({
      exceptionFactory: (errors) => formatErrors(errors),
    });

    return await validationPipe.transform(value, metadata);
  }
}
