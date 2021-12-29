import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import moment from "moment";
import { nanoid } from "nanoid";
import { ApiService } from "src/modules/apikey/api.service";
import { User } from "src/modules/user/user.entity";
import { UAParser } from "ua-parser-js";
import { CacheService } from "../cache/cache.service";
import { ITokenData } from "./token.type";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenService {
    constructor(
        private readonly apiService: ApiService,
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
    ) {}
    async generateToken(user: User, headers: Request['headers']) {

        if(!headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }

        const apiKey = await this.apiService.getApiKey(headers['x-api-key'] as string)
        
        const parser = new UAParser();
        parser.setUA(headers['user-agent']);

        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            user.id,
            user.role,
            apiKey.key,
            apiKey.access_level,
            parser.getDevice().type || "",
            parser.getBrowser().name || "",
            moment().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');
        
        await this.cacheService.set(`${user.id}_${parser.getBrowser().name || ""}_${parser.getDevice().type || ""}`, text);
        return text
    }

    async validateAccessToken (headers: Request['headers']): Promise<boolean> {
        if(!headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        
        if(!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }
        
        const code = headers.authorization.replace('Bearer ','');
        
        const parser = new UAParser();
        parser.setUA(headers['user-agent']);
        
        const [,
            appId,
            userId,
            /* userRole */,
            apiKey,
            /* apiAccess */,
            deviceType,
            browser,
            time,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");
        
        if (await this.cacheService.get(`${userId}_${browser}_${deviceType}`) !== code) {
            throw new UnauthorizedException("Invalid Authorization token")
        }
        
        if(appId !== this.configService.get("APP_ID")) {
            throw new UnauthorizedException("App id is invalid")
        }
        
        if(apiKey !== headers['x-api-key']) {
            throw new ForbiddenException("Api key is invalid")
        }
        
        if(!moment(time).isBetween(moment().subtract(1, 'day'), moment())) {
            throw new UnauthorizedException("Reset token expired its duration")
        }

        return true;
    }

    async removeToken(headers: Request['headers']): Promise<any> {
        if(!headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        
        if(!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }
        
        const code = headers.authorization.replace('Bearer ','');
        
        const [,
            /* appId */,
            userId,
            /* userRole */,
            /* apiKey */,
            /* apiAccess */,
            deviceType,
            browser,
            /* time */,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");
        
        return await this.cacheService.del(`${userId}_${browser}_${deviceType}`)
    }

    getTokenData(headers: Request['headers']): ITokenData {
        if(!headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        
        if(!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }
        
        const code = headers.authorization.replace('Bearer ','');
        
        const [
            tokenId,
            appId,
            userId,
            userRole,
            apiKey,
            apiAccess,
            deviceType,
            browser,
            tokenTime,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");

        return {
            tokenId,
            appId,
            userId,
            userRole: parseInt(userRole),
            apiKey,
            apiAccess: parseInt(apiAccess),
            deviceType,
            browser,
            tokenTime,
        }
    }
}