import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import { CacheService } from "../cache/cache.service";
import { User } from "../user/user.entity";
import { TokenParams } from "./auth.dto";
import nodemailer from 'nodemailer';
import moment from 'moment';
import Handlebars from "handlebars";
import { join } from 'path';
import { readFileSync } from "fs";

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private cacheService: CacheService,
    ) { }

    async generateToken(tokenInfo: TokenParams) {
        const keyFactors = [
            tokenInfo.id || nanoid(), // Token Id
            this.configService.get("APP_ID"),
            tokenInfo.user_id,
            tokenInfo.email,
            tokenInfo.api_key,
            tokenInfo.device_type || "",
            tokenInfo.browser_name || "",
            moment().toISOString(),
        ];

        const textToEncrypt = `${keyFactors.join('|')}`;
        const text = Buffer.from(textToEncrypt).toString('base64');

        await this.cacheService.set(`${tokenInfo.user_id}_${tokenInfo.browser_name}_${tokenInfo.device_type}`, text);
        return text
    }

    validateUserToken(token: string): boolean {
        console.log("Validating Token", token);
        return false;
    }

    refreshToken() {
        console.log("Refreshing the token")
    }

    async generateResetCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.id,
            moment().toISOString(),
        ];

        const textToEncrypt = `${keyFactors.join('|')}`;
        const text = Buffer.from(textToEncrypt).toString('base64');

        await this.cacheService.set(`reset_${userInfo.id}`, text);
        return text
    }

    async generateActivationCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.id,
            moment().toISOString(),
        ];

        const textToEncrypt = `${keyFactors.join('|')}`;
        const text = Buffer.from(textToEncrypt).toString('base64');

        await this.cacheService.set(`active_${userInfo.id}`, text);
        return text
    }

    async getDataFromResetCode(code: string): Promise<Array<string>> {
        const [
            codeId, // Token Id
            appId,
            userId,
            userEmail,
            codeDate,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");

        const storedCode = await this.cacheService.get(`reset_${userId}`)
        if (!storedCode) throw new ForbiddenException("The code is invalid");

        return [codeId, appId, userId, userEmail, codeDate]
    }

    generateActivationMarkup(user: User, code:string) : string {
        
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

    async sendActivationCode(user: User) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get("SMTP_USER"), // generated ethereal user
                pass: this.configService.get("SMTP_PASSWORD"), // generated ethereal password
            },

        });

        const code = await this.generateActivationCode(user);
        
        // send mail with defined transport object
        return await transporter.sendMail({
            from: '"Fehm" <no-reply@fehm.live>', // sender address
            to: user.email, // list of receivers
            subject: "Activate your account", // Subject line
            html: this.generateActivationMarkup(user, code), // pass user
        });
    }
}