import { BadRequestException, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from 'nodemailer';
import { User } from "../../modules/user/user.entity";

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
    constructor(private configService: ConfigService){}
    
    transporter: nodemailer.Transporter;

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get("SMTP_USER"), // generated ethereal user
                pass: this.configService.get("SMTP_PASSWORD"), // generated ethereal password
            },
        });
    }

    onModuleDestroy() {
        this.transporter.close();
    }

    async sendEmailTemplate(to: User['email'], subject: string,  markup: string) {
        // send mail with defined transport object
        const response = await this.transporter.sendMail({
            from: '"Fehm" <no-reply@fehm.live>', // sender address
            to, // list of receivers
            subject, // Subject line
            html: markup, // pass user
        });

        if(response.rejected.includes(to)) {
            throw new BadRequestException("Email cannot be sent to user at the moment")
        }

        return response;
    }
}