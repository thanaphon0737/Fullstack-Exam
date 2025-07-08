import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';


@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  // create instance WebSocket server
  @WebSocketServer()
  server: Server;

  // logging
  private readonly logger = new Logger(EventsGateway.name);
  private redisSubscriber: Redis;

  constructor(private configService: ConfigService) {}

  // after server initial
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
    
    // setup for Redis Sub
    this.redisSubscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });

    // listen channel 'order_events'
    this.redisSubscriber.subscribe('order_events', (err, count) => {
      if (err) {
        this.logger.error('Failed to subscribe to Redis channel', err);
        return;
      }
      this.logger.log(`Subscribed to ${count} Redis channel(s). Listening for order_events...`);
    });

    // when message coming in channel
    this.redisSubscriber.on('message', (channel, message) => {
      this.logger.log(`Received message from channel ${channel}: ${message}`);
      
      // broadcast message to client
      // sending event 'order_update'
      this.server.emit('order_update', JSON.parse(message));
    });
  }

  // when client connect
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // when client dis
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // for test sending message to server
  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {
    // response message to client
    this.server.to(client.id).emit('messageToClient', `Server received: ${payload}`);
  }
}
