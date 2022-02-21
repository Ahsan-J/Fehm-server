import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/modules/user/user.entity';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports:["websocket", "polling"],
  namespace: /^\/user-(.)+$/,
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

  @SubscribeMessage('icecandidate-sent')
  onIceCandidate(@MessageBody() data: any) {
    console.log(data)
    this.server.to(this.connections[data?.user_id]).emit("icecandidate-receive", data.candidate)
  }

  @SubscribeMessage("call-user")
  callUser(@MessageBody() data: any) {
    console.log("Sending call-user to " + this.connections[data?.to], data?.to)
    this.server.to(this.connections[data?.to]).emit("call-made", {
      offer: data.offer,
      from: data.from, // who is calling
      to: data.to, // who is receiving
    })
  }

  @SubscribeMessage("make-answer")
  makeAnswer(@MessageBody() data: any) {
    console.log("Sending make-answer to " + this.connections[data?.from], data?.from)
    this.server.to(this.connections[data?.from]).emit("answer-made", {
      answer: data.answer,
      from: data.from, // who is calling
      to: data.to, // who is receiving
    })
  }

  @SubscribeMessage("request-end-call")
  RequestEndCall(@MessageBody() data: any) {
    console.log("Sending request-end-call to " + this.connections[data?.to], data?.to)
    this.server.to(this.connections[data?.to]).emit("end-call", data)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): any {
    console.log(this.server)
    return data;
  }
}
