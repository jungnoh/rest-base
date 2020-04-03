/* eslint-disable @typescript-eslint/no-explicit-any */
import {Strategy as LocalStrategy} from 'passport-local';
import UserEntity from '../models/user';
import * as AuthService from '../services/auth';
import { User } from '../../../common/models';

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'username'
}, async (_, username, password, done) => {
  try {
    const result = await AuthService.authenticate(username, password);
    if (result.success) {
      return done(null, result.result!);
    } else {
      return done(result.reason);
    }
  } catch (err) {
    return done(err);
  }
});

/**
 * @description Serializes a `User` object to a `SerializedUser`
 * @param user `User` model object
 * @param done Callback function
 */
export const serialize = (user: User, done: any) => {
  done(null, user.username);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (username: string, done: any) => {
  AuthService.view(username).then(result => {
    if (!result.success) {
      done(result.reason!);
    } else {
      done(null, result.result!);
    }
  });
};
