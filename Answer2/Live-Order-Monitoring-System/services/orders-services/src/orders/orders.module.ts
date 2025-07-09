import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Module({
  imports: [TypeOrmModule.forFeature([Order]),ConfigModule,],
  controllers: [OrdersController],
  providers: [OrdersService,

    {
      provide: 'REDIS_CLIENT', // provider
      useFactory: (configService: ConfigService) => {
        // 
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
      inject: [ConfigService], // 
    },

  ],
})
export class OrdersModule {}
