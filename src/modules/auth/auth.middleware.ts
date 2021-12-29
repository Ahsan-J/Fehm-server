import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { TokenService } from "src/helper-modules/token/token.service";
import { ApiService } from "../apikey/api.service";

@Injectable()
export class AuthAPIKeyMiddleware implements NestMiddleware {
    constructor(
        @Inject(TokenService)
        private tokenService: TokenService,
        private apiService: ApiService,
        ) {}
        
    async use(req: any, res: any, next: () => void) {
        const { apiKey:key, apiAccess:access } = this.tokenService.getTokenData(req.headers);
        await this.apiService.validateApiKeyAccess(key, access);
        next();
    }
}