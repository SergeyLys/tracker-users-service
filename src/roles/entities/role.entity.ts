import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/entities/user-role.entity';
import type { CreationOptional } from 'sequelize';

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @BelongsToMany(() => User, () => UserRole)
  declare users: User[];
}
