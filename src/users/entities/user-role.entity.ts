import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @ForeignKey(() => Role)
  @Column
  declare roleId: string;
}
