import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Ignore404Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/') {
      // Завершаем запрос без отправки ошибки 404
      return res.send();
    }
    next();
  }
}
