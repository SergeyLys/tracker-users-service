import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { UserRole } from './users/entities/user-role.entity';
import { PinoLoggerModule } from '@SergeyLys/tracker-pinno-logger';
import { OAuthIdentity } from './oauth-identity/entities/oauth-identity.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'users_user',
      password: process.env.DATABASE_PASSWORD || 'users_password',
      database: process.env.DATABASE_NAME || 'users_db',
      models: [User, Role, UserRole, OAuthIdentity],
      autoLoadModels: true,
    }),
    UsersModule,
    PinoLoggerModule
  ],
})
export class AppModule {}
