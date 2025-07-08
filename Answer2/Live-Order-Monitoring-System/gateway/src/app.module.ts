import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from './events/events.gateway';
@Module({
  imports: [
    // for .env and httpservice
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    // for passport use jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy,EventsGateway],
})
export class AppModule {}
