import { User } from '../entities/user.entity';

export interface ValidateStrategy<T extends unknown> {
  name: string;

  validateUser(credentials: T): Promise<User | null>;
}