import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import { CacheService } from "../../helper-modules/cache/cache.service";
import { User } from "../user/user.entity";
import { HeaderParams } from "./auth.dto";
import moment from 'moment';
import Handlebars from "handlebars";
import { join } from 'path';
import { readFileSync } from "fs";
import { UAParser } from 'ua-parser-js'
import { Request } from "express";

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private cacheService: CacheService,
    ) { }

    async generateToken(user: User, headers: HeaderParams) {

        if(!headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        
        const parser = new UAParser();
        parser.setUA(headers['user-agent']);

        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            user.id,
            headers['x-api-key'],
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
            apiKey,
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
        
        const [,,
            userId,,
            deviceType,
            browser,,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");
        
        return await this.cacheService.del(`${userId}_${browser}_${deviceType}`)
    }

    getTokenData(headers: Request['headers']): {[key in string]: string} {
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
            apiKey,
            deviceType,
            browser,
            tokenTime,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");

        return {
            tokenId,
            appId,
            userId,
            apiKey,
            deviceType,
            browser,
            tokenTime,
        }
    }

    // Reset Process ************************************************************

    async generateResetCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.email,
            moment().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');

        await this.cacheService.set(`reset_${userInfo.email}`, text);
        return text
    }

    async validateResetCode(userInfo: User, code: string): Promise<boolean> {
        if(!code) {
            throw new BadRequestException("Reset Code is missing")
        }

        if(await this.cacheService.get(`reset_${userInfo.email}`) !== code) {
            throw new BadRequestException("Invalid Reset Password Code for User")
        }

        const [, appId, userId, time] = Buffer.from(code, 'base64').toString('ascii').split("|");

        if(appId !== this.configService.get("APP_ID")) {
            throw new BadRequestException("Invalid Reset code for App")
        }

        if(userId !== userInfo.id) {
            throw new BadRequestException("Invalid Reset for matching User")
        }

        if(!moment(time).isBetween(moment().subtract(1, 'day'), moment())) {
            throw new BadRequestException("Reset token expired its duration")
        }

        return true;
    }

    async generateResetMarkup(user: User, code?: string): Promise<string> {
        code = code || await this.generateResetCode(user);
        const filePath = join(process.cwd(), 'template', "reset-password.hbs");
        const markup = readFileSync(filePath, { encoding: "utf-8" })

        Handlebars.registerHelper("link_code", (t) => {
            const url = Handlebars.escapeExpression(`http://localhost:3000/auth/reset-password?code=${code}&email=${user.email}`)
            const text = Handlebars.escapeExpression(t)
            return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>");
        });

        const template = Handlebars.compile(markup);
        return template({ user })
    }

    // Activation Process *********************************************************
    async generateActivationCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.id,
            moment().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');

        await this.cacheService.set(`active_${userInfo.id}`, text);
        return text
    }

    async validateActivationCode(userInfo: User, code: string): Promise<boolean> {
        if(!code) {
            throw new BadRequestException("Reset Code is missing")
        }
        
        if(await this.cacheService.get(`active_${userInfo.id}`) !== code) {
            throw new BadRequestException("Invalid Activation Code for User")
        }

        const [, appId, userId, time] = Buffer.from(code, 'base64').toString('ascii').split("|")
        
        if(appId !== this.configService.get("APP_ID")) {
            throw new BadRequestException("Invalid Activation code for App")
        }

        if(userId !== userInfo.id) {
            throw new BadRequestException("Invalid Activation for matching User")
        }

        if(!moment(time).isBetween(moment().subtract(1, 'day'), moment())) {
            throw new BadRequestException("Activation token expired its duration")
        }

        return true;
    }

    async generateActivationMarkup(user: User, code?: string): Promise<string> {

        code = code || await this.generateActivationCode(user)

        const filePath = join(process.cwd(), 'template', "activation.hbs");
        const markup = readFileSync(filePath, { encoding: "utf-8" })

        Handlebars.registerHelper("link_code", (t) => {
            const url = Handlebars.escapeExpression(`http://localhost:3000/auth/activate?code=${code}&id=${user.id}`)
            const text = Handlebars.escapeExpression(t)
            return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>");
        });

        const template = Handlebars.compile(markup);
        return template({ user })
    }
}