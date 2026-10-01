import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Unique,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import type { CreationOptional, InferCreationAttributes } from 'sequelize';
import { UserRole } from './user-role.entity';
import { CommonAuthTypes } from '@SergeyLys/tracker-contracts';
import { Role } from '../../roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

type CreateUserRequest = CommonAuthTypes.RegisterRequest;

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, InferCreationAttributes<User>> {
  @ApiProperty({ example: '1', description: 'Uniq id' })
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: CreationOptional<string>;

  @ApiProperty({ example: 'test@mail.com', description: 'Uniq id' })
  @Unique
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column(DataType.STRING)
  declare passwordHash: CreationOptional<string>;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isEmailVerified: CreationOptional<boolean>;

  @ApiProperty({ example: 'Name', description: 'Users name' })
  @Column({ type: DataType.STRING, allowNull: true })
  declare name: CreationOptional<string>;

  @ApiProperty({ example: 'Age', description: 'Users age' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age: CreationOptional<number>;

  @ApiProperty({ example: 'Weight', description: 'Users weight' })
  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare weight: CreationOptional<number>;

  @ApiProperty({ example: 'Height', description: 'Users height' })
  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare height: CreationOptional<number>;

  @ApiProperty({ example: '0', description: 'Gender' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare gender: CreationOptional<number>;

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: CreationOptional<Role[]>;
}
