import { CACHE_MANAGER, ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../cache/cache.service';
import { UAParser } from 'ua-parser-js'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private cacheService: CacheService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const [bearer, text] = req.headers['authorization'].split(" ");
    if(bearer.toLowerCase() != "bearer") throw new ForbiddenException("Invalid Token")

    const parser = new UAParser()
    parser.setUA(req.headers['user-agent'])

    const [ tokenId, appId, userId ] = Buffer.from(text, 'base64').toString('ascii').split("|");
    const tokenDetail = await this.cacheService.get(`${userId}_${parser.getBrowser().name}_${parser.getDevice().type}`);
    
    if(!tokenDetail) throw new ForbiddenException("Token Expired");
    if(tokenDetail !== text) throw new ForbiddenException("Token not valid") 

    next();
  }
}
