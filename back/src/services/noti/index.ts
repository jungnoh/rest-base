/* eslint-disable @typescript-eslint/camelcase */
import * as firebase from 'firebase-admin';
import winston from 'winston';
import * as ConfigService from '../config';
import * as Send from './send';
import { NotiDescription } from './types';

export async function init() {
  console.log('Firebase: Initializing');
  firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
    databaseURL: `https://${process.env.FCM_DB}.firebaseio.com`
  });
  console.log('Firebase: Init complete');
}

/**
 * @description 알림을 발송합니다.
 * @param data 발송 정보
 */
export async function send(data: NotiDescription) {
  const tasks = [];
  if (data.internal) {
    tasks.push(async () => {
      try {
        const users = data.users.map(x => x.id);
        const targetUser = data.users.length === 1 ? data.users[0].username : `(${users.length}명)`;
        await Send.internal(users, data.payload, targetUser);
      } catch (err) {
        winston.warn('noti: Error during internal send: \n'+err);
      }
    });
  }
  if (data.push) {
    tasks.push(async () => {
      try {
        const users = data.users.filter(x => typeof x.fcmToken !== 'undefined' && x.fcmToken.trim() !== '');
        const targetUser = data.users.length === 1 ? data.users[0].username : `(${users.length}명)`;
        await Send.fcm(users.map(x => x.fcmToken), data.payload, targetUser);
      } catch (err) {
        winston.warn('noti: Error during push send: \n'+err);
      }
    });
  }
  if (data.sms) {
    tasks.push(async () => {
      try {
        const users = data.users.filter(x => typeof x.phone !== 'undefined' && x.phone.trim() !== '');
        const targetUser = data.users.length === 1 ? data.users[0].username : `(${users.length}명)`;
        await Send.sms(users.map(x => x.phone), data.payload, targetUser);
      } catch (err) {
        winston.warn('noti: Error during sms send: \n'+err);
      }
    });
  }
  await Promise.all(tasks);
}

/**
 * @description 관리자에게 SMS를 전송합니다.
 * @param message 메세지 내용
 */
export async function smsToAdmin(message: string) {
  const users = ((await ConfigService.get('SMS_ADMIN_PHONE_KEY')) ?? '')
    .split(',')
    .map(x => x.trim());
  await Send.sms(users, {
    message,
    title: '',
    url: ''
  }, '(관리자)', false);
}
