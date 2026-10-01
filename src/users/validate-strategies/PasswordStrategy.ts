import { Injectable } from "@nestjs/common";
import { ValidateStrategy } from "./ValidateStrategy";
import { RpcException } from "@nestjs/microservices/exceptions/rpc-exception";
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { InjectModel } from "@nestjs/sequelize";
import type { InferCreationAttributes } from 'sequelize';

@Injectable()
export class PasswordStrategy implements ValidateStrategy<InferCreationAttributes<User>> {
  name = "password";

  constructor(
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async validateUser(credentials: InferCreationAttributes<User> & { password: string }) {
    const candidate = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!candidate) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: "Email or password is not correct",
      });
    }
    
    if (!credentials.password) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: 'Email or password is not correct',
      });
    }

    const passwordEquals = await bcrypt.compare(
      credentials.password,
      candidate.passwordHash,
    );

    if (!passwordEquals) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: 'Email or password is not correct',
      });
    }

    return candidate;
  }
}