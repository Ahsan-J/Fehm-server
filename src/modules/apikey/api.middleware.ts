import { CACHE_MANAGER, ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../cache/cache.service';
import { UAParser } from 'ua-parser-js'

@Injectable()
export class APIMiddleware implements NestMiddleware {  

  async use(req: Request, res: Response, next: NextFunction) {
    // Validating the API key
    next();
  }
}
