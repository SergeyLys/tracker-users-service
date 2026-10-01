import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { UserServiceTypes } from '@SergeyLys/tracker-contracts';
import { protoPath } from '@SergeyLys/tracker-contracts/paths';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserServiceTypes.protobufPackage,
      protoPath: join(protoPath, 'user', 'user-service.proto'),
      loader: {
        includeDirs: [
          protoPath,
        ],
      },
      url: process.env.USER_SERVICE_GRPC_URL
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
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
  });

  await app.startAllMicroservices();
}
bootstrap();
