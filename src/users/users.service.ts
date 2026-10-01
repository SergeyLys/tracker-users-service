import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcryptjs';
import { Schemas } from '@SergeyLys/tracker-contracts';
import { Role } from '../roles/entities/role.entity';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { PasswordStrategy } from './validate-strategies/PasswordStrategy';
import { GoogleStrategy } from './validate-strategies/GoogleStrategy';
import { ValidateStrategy } from './validate-strategies/ValidateStrategy';

type CreateUserRequest = Schemas.RegisterRequest;
type ValidateUserRequest = Schemas.LoginRequest;

@Injectable()
export class UsersService {
  private validatingStrategies: Record<string, ValidateStrategy<unknown>> = {};
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    private readonly passwordStrategy: PasswordStrategy,
    private readonly googleStrategy: GoogleStrategy,
  ) {
    this.validatingStrategies = {
      password: this.passwordStrategy,
      google: this.googleStrategy,
    };
  }

  async rollbackUser(userId: number) {
    await this.userRepository.destroy({ where: { id: userId } });
  }

  async create(createUserDto: CreateUserRequest) {
    const parsedRequest = Schemas.RegisterRequestSchema.parse(createUserDto);
    const { password, name, email, role } = parsedRequest;

    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new RpcException({
        code: GrpcStatus.ALREADY_EXISTS,
        message: 'User with this email already exists',
      });
    }

    // const foundRole = await this.roleRepository.findOne({
    //   where: { name: role[0] },
    // });

    // if (!foundRole) {
    //   throw new RpcException({
    //     code: GrpcStatus.NOT_FOUND,
    //     message: `Role ${role[0]} not found`,
    //   });
    // }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash: passwordHash,
    });

    // await user.$set('roles', [foundRole.id]);

    // const result = await this.userRepository.findByPk(user.id, { include: [Role] });

    return user;
  }

  async validateUser(dto: ValidateUserRequest) {
    const parsedRequest = Schemas.LoginRequestSchema.parse(dto);

    const strategy = this.validatingStrategies[parsedRequest.provider];

    if (!strategy) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: `Validation provider ${parsedRequest.provider} is not supported`,
      });
    }

    return strategy.validateUser(parsedRequest);
  }

  async getUserById(userId: string) {
    const candidate = this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!candidate) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return candidate;
  }
}
