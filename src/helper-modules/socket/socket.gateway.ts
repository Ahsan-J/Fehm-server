import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/modules/user/user.entity';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports:["websocket", "polling"],
  namespace: /^\/user-\d+$/,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  connections: {[key in string]: string};
  
  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.nsp.name.split("-").pop();
    this.connections = {
      ...this.connections,
      [userId]: client.id,
    };
  }
  
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.nsp.name.split("-").pop();
    delete this.connections[userId];
  }

  sendEvent(userList: Array<User['id']>, event: string, data: any) {
    const sent: Array<User['id']> = [];
    const failed: Array<User['id']> = [];

    userList.forEach((userId: User['id']) => {
        if(this.connections[userId]) {
            this.server.to(this.connections[userId]).emit(event, data);
            sent.push(userId);
        } else {
            failed.push(userId);
        }
    });

    return { sent, failed };
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): any {
    console.log(this.server)
    return data;
  }
}
