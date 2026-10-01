import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { PasswordStrategy } from './validate-strategies/PasswordStrategy';
import { GoogleStrategy } from './validate-strategies/GoogleStrategy';
import { OAuthIdentity } from '../oauth-identity/entities/oauth-identity.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, OAuthIdentity]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              `amqp://admin:${process.env.RABBITMQ_PASSWORD}@rabbitmq:5672`,
          ],
          queue: process.env.RABBITMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordStrategy, GoogleStrategy],
})
export class UsersModule {}
