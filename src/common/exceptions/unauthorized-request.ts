import { BadRequestException as Exception } from '@nestjs/common';

export class UnauthorizedRequestException extends Exception {
  constructor(message?: any, error?: string) {
    let msg: Record<string, unknown> | string | undefined;

    if (message && message instanceof Object) {
      msg = {
        statusCode: 401,
        error: 'Unauthorized',
        message: [message],
      };
    } else if (message && typeof message === 'string') {
      msg = message;
    }

    super(msg, error);
  }
}
