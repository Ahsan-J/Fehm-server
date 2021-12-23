import { Controller, Get, Headers } from '@nestjs/common';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
    @Get()
    async getUserNotification(@Headers() headers: Request['headers']) : Promise<any> {
        headers.authorization
    }
}
