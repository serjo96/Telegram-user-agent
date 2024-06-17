import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('request: ', req.method, ' ', req.url, ' body: ', req.body);
    console.log('response ', res.statusCode);
    next();
  }
}
