// 사용자 모델 중 인증 및 인증 관리를 위한 서비스입니다. (사용자 관리는 포함되지 않음)

import AddressModel from '../models/address';
import UserModel from '../models/user';
import * as Password from '../util/password';
import User, { UserSignup } from '../../../common/models/user';
import lodash from 'lodash';
import { ServiceResult } from 'src/util/types';

export const USER_CHANGEABLE_FIELDS = [
  'allowSNS', 'allowPush', 'address', 'phone', 'email', 'password'
];

/**
 * @description 사용자를 인증합니다.
 * @param username 사용자명
 * @param password 비밀번호
 */
export async function authenticate(username: string, password: string):
ServiceResult<'BAD_CREDENTIALS' | 'INACTIVE', User> {
  const user = await UserModel.findOne({username});
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
      success: false,
      reason: 'INACTIVE'
    };
  }
  return {
    success: true,
    result: user
  };
}

/**
 * @description 사용자를 생성합니다.
 * @param profile 생성할 사용자 프로필
 */
export async function create(profile: UserSignup):
ServiceResult<'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'IMPKEY_EXISTS', User> {
  // 이메일, 사용자명이 존재하는지 체크
  const existingUser = await UserModel.findOne({$or: [
    {username: profile.username},
    {email: profile.email},
    {impIdentityKey: profile.impIdentityKey, phone: profile.phone}
  ]});
  if (existingUser !== null) {
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

  const addressObj = await AddressModel.create(profile.address);

  const userObj = await UserModel.create(Object.assign(profile, {
    password: await Password.hash(profile.password),
    address: addressObj
  }));
  return {
    success: true,
    result: userObj
  };
}

/**
 * 
 * @param username 변경할 사용자명
 * @param change 변경할 내용
 * @param isAdmin 관리자 여부. 관리자가 아닐 경우 `USER_CHANGEABLE_FIELDS` 내 필드만 변경됨
 */
export async function update(username: string, change: Partial<User>, isAdmin = false):
ServiceResult<'USER_NEXIST'> {
  let updates = change;
  if (!isAdmin) {
    updates = lodash.pick(change, USER_CHANGEABLE_FIELDS);
  }
  let error = null;

  const user = await UserModel.findOne({username});
  if (!user) {
    error = 'USER_NEXIST';
    return {success: false, reason: 'USER_NEXIST'};
  }
  Object.assign(user, updates);
  await user.save();
  return {success: true};
}

/**
 * @description 사용자 정보를 반환합니다.
 * @param username 사용자명
 */
export async function view(username: string): ServiceResult<'USER_NEXIST', User> {
  const user = await UserModel.findOne({username});
  if (!user) {
    return {success: false, reason: 'USER_NEXIST'};
  }
  return {success: true, result: user};
}
