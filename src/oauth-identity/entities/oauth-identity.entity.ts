import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import type { CreationOptional, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'oauth-identities' })
export class OAuthIdentity extends Model<OAuthIdentity, 
  InferCreationAttributes<OAuthIdentity>
> {
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
  })
  declare provider: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare providerId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: CreationOptional<User>;
}
