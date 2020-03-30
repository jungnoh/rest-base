// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)

import { getRepository, getManager } from "typeorm";
import UserEntity from "../models/user";
import * as Password from "../util/password";
import User, { UserSignup } from "../../../common/models/user";
import lodash from "lodash";
import { ServiceResult } from "src/util/types";

export const USER_CHANGEABLE_FIELDS = [
  'allowSNS', 'allowPush', 'address', 'phone', 'email', 'password'
];

/**
 * @description 사용자를 인증합니다.
 * @param username 사용자명
 * @param password 비밀번호
 */
export async function authenticate(username: string, password: string):
ServiceResult<'BAD_CREDENTIALS' | 'INACTIVE'> {
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

/**
 * @description 사용자를 생성합니다.
 * @param profile 생성할 사용자 프로필
 */
export async function create(profile: UserSignup):
ServiceResult<'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'IMPKEY_EXISTS'> {
  try {
    // 이메일, 사용자명이 존재하는지 체크
    const existingUser = await getManager()
      .createQueryBuilder(UserEntity, 'user')
      .where(`user.username = :username
        OR user.email = :email
        OR (user.impIdentityKey = :impIdentityKey AND user.phone = :phone)`, profile)
      .getOne();
    if (existingUser !== undefined) {
      if (existingUser.username === profile.username) {
        return {
          success: false,
          reason: 'USERNAME_EXISTS'
        };
      } else if (existingUser.email === profile.email) {
        return {
          success: false,
          reason: 'EMAIL_EXISTS'
        };
      } else {
        return {
          success: false,
          reason: 'IMPKEY_EXISTS'
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

/**
 * 
 * @param username 변경할 사용자명
 * @param change 변경할 내용
 * @param isAdmin 관리자 여부. 관리자가 아닐 경우 `USER_CHANGEABLE_FIELDS` 내 필드만 변경됨
 */
export async function update(username: string, change: Partial<User>, isAdmin = false):
ServiceResult<'USER_NEXIST'> {
  try {
    let updates = change;
    if (!isAdmin) {
      updates = lodash.pick(change, USER_CHANGEABLE_FIELDS);
    }
    let error = null;
    await getManager().transaction(async manager => {
      const user = manager.findOne(UserEntity, {username});
      if (!user) {
        error = 'USER_NEXIST';
        return;
      }
      Object.assign(user, updates);
      await manager.save(user);
    });
    if (error) {
      return {success: false, reason: error};
    } else {
      return {success: true};
    }
  } catch (err) {
    throw err;
  }
}

/**
 * @description 사용자 정보를 반환합니다.
 * @param username 사용자명
 */
export async function view(username: string): ServiceResult<'USER_NEXIST', User> {
  try {
    const user = await getManager().findOne(UserEntity, {username});
    if (!user) {
      return {success: false, reason: 'USER_NEXIST'};
    }
    return {success: true, result: user};
  } catch (err) {
    throw err;
  }
}
