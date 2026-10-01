import { Injectable } from "@nestjs/common";
import { ValidateStrategy } from "./ValidateStrategy";
import { InjectModel } from '@nestjs/sequelize';
import type { InferCreationAttributes } from 'sequelize';
import { OAuthIdentity } from "../../oauth-identity/entities/oauth-identity.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class GoogleStrategy implements ValidateStrategy<InferCreationAttributes<OAuthIdentity>> {
  name = "google";

  constructor(
    @InjectModel(OAuthIdentity) private readonly oauthIdentityRepository: typeof OAuthIdentity,
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async validateUser(credentials: InferCreationAttributes<OAuthIdentity>) {
    const transaction = await this.userRepository.sequelize!.transaction();

    try {
      const identity = await this.oauthIdentityRepository.findOne({
        where: { provider: 'google', providerId: credentials.providerId },
        transaction
      });

      if (identity?.userId) {
        return this.userRepository.findByPk(identity.userId, { transaction });
      }

      const [existingUser] = await this.userRepository.findOrCreate({
        where: { email: credentials.email },
        transaction
      });

      await this.oauthIdentityRepository.create({
        provider: 'google',
        providerId: credentials.providerId,
        email: credentials.email,
        userId: existingUser.id,
      }, { transaction });

      await transaction.commit();

      return existingUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}