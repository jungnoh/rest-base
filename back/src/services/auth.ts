// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)

import { getRepository, getManager } from "typeorm";
import UserEntity from "../models/user";
import * as Password from "../util/password";
import User, { UserSignup } from "../../../common/models/user";

/**
 * @description 사용자를 인증합니다.
 * @param username 사용자명
 * @param password 비밀번호
 */
export async function authenticate(username: string, password: string): Promise<{
  success: boolean;
  reason?: 'BAD_CREDENTIALS' | 'INACTIVE';
}> {
  try {
    const userRepo = getRepository(UserEntity);
    const user = await userRepo.findOne({username});
    if (!user) {
      return {
        success: false,
        reason: 'BAD_CREDENTIALS'
      };
    }
    if (!(await Password.verify(user.password, password))) {
      return {
        success: false,
        reason: 'BAD_CREDENTIALS'
      };
    }
    if (!user.active) {
      return {
        success: true,
        reason: 'INACTIVE'
      };
    }
    return {
      success: true
    };
  } catch (err) {
    throw err;
  }
}

export async function create(profile: UserSignup): Promise<{
  success: boolean;
  reason?: 'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'IMPKEY_EXISTS'
}> {
  try {
    // 이메일, 사용자명이 존재하는지 체크
    const existingUser = await getManager()
      .createQueryBuilder(UserEntity, 'user')
      .where('user.username = :username OR user.email = :email', profile)
      .getOne();
    if (existingUser !== undefined) {
      if (existingUser.username === profile.username) {
        return {
          success: false,
          reason: 'USERNAME_EXISTS'
        };
      } else {
        return {
          success: false,
          reason: 'EMAIL_EXISTS'
        };
      }
    }

    const userObj = new UserEntity();
    Object.assign(userObj, profile);
    userObj.password = await Password.hash(userObj.password);
    userObj.landingPage = '{}';

    await getManager().transaction(async manager => {
      await manager.save(userObj);
    });

    return {
      success: true
    };
  } catch (err) {
    throw err;
  }
}