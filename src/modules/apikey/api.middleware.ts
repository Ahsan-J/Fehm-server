import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { ApiService } from "../apikey/api.service";

@Injectable()
export class ApiMiddleware implements NestMiddleware {
    constructor(
        private apiService: ApiService,
        ) {}
        
    async use(req: any, res: any, next: () => void) {
        if(!req.headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        const key = req.headers['x-api-key'];
        await this.apiService.validateApiKeyAccess(key);
        next();
    }
}