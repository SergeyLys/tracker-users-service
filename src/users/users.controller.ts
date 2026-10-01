import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserServiceTypes,
  CommonAuthTypes,
} from '@SergeyLys/tracker-contracts';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

const { USER_SERVICE_NAME, UserServiceControllerMethods } = UserServiceTypes;

type UserServiceController = UserServiceTypes.UserServiceController;
type UserResponse = UserServiceTypes.UserResponse;
type CreateUserRequest = CommonAuthTypes.RegisterRequest;
type ValidateUserRequest = CommonAuthTypes.LoginRequest;
type GetUserByIdRequest = UserServiceTypes.GetUserByIdRequest;

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  async createUser(createUserDto: CreateUserRequest): Promise<UserResponse> {
    const user = await this.usersService.create(createUserDto);
    return { user: user || undefined };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ValidateUser')
  async validateUser(request: ValidateUserRequest): Promise<UserResponse> {
    const user = await this.usersService.validateUser(request);
    return { user: user || undefined };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  async getUserById(request: GetUserByIdRequest): Promise<UserResponse> {
    const user = await this.usersService.getUserById(request.userId);
    return { user: user || undefined };
  }
}
