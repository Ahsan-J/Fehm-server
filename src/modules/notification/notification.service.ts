import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/helper-modules/socket/socket.gateway';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationService {
    constructor(
        private socketGateway: SocketGateway,
    ) {}

    notifySocketUser(user: User) {
        this.socketGateway.sendEvent([user.id], "message", `Hello ${user.id}`);
    }
}
