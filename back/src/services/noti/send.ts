/**
 * @description 여러 사용자에게 채널별로 알림을 전송합니다.
 */
import axios from 'axios';
import * as firebase from 'firebase-admin';
import moment from 'moment';
import qs from 'querystring';
import winston from 'winston';
import { ObjectID } from 'bson';
import { NotiPayload } from './types';
import { PushModel } from '../../models/push';
import * as ConfigService from '../config';
import * as LogService from '../log';
import * as Config from './config';

/**
 * @description 사이트 내 표시되는 방식으로 알림을 전송합니다.
 * @param users 사용자 ObjectId 목록
 * @param payload 발송 데이터
 * @param targetUser 로그에 표시할 수신자 텍스트
 */
export async function internal(users: ObjectID[], payload: NotiPayload, targetUser: string) {
  let success = 0, fail = 0;
  await Promise.all(users.map(user => async () => {
    try {
      await PushModel.create({
        message: payload.message,
        title: payload.title,
        link: payload.url,
        user: user
      });
      success++;
    } catch {
      fail++;
    }
  }));
  await LogService.addNotiSend('internal', payload.message, success, fail, targetUser);
}

/**
 * @description SMS를 전송합니다.
 * @param users 사용자 전화번호 목록
 * @param payload 발송 데이터
 * @param targetUser 로그에 표시할 수신자 텍스트
 */
export async function sms(users: string[], payload: NotiPayload, targetUser: string, padMessage = true) {
  let success = 0, fail = 0, ok = true;

  const header = (await ConfigService.get(Config.SMS_HEADER_KEY)) ?? '';
  const footer = (await ConfigService.get(Config.SMS_FOOTER_KEY)) ?? '';
  const aligoKey = (await ConfigService.get(Config.ALIGO_API_KEY)) ?? '';
  const aligoSender = (await ConfigService.get(Config.ALIGO_SENDER_KEY)) ?? '';
  const aligoUser = (await ConfigService.get(Config.ALIGO_USER_KEY)) ?? '';
  const message = padMessage ? `${header} ${payload.message} ${footer}`.trim() : payload.message;
  
  if (users.length === 0) {
    return;
  }
  for (let i=0; i<users.length; i++) {
    const numberList = users.slice(i, i+1000).join(',');
    const req: {[key: string]: string} = {
      key: aligoKey,
      user_id: aligoUser,
      sender: aligoSender,
      receiver: numberList,
      msg: message
    };
    try {
      const resp = await axios.post(
        qs.stringify(req),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      );
      if (resp.data.result_code < 0) {
        await LogService.addNotiFail('sms', resp.data.message, targetUser);
        ok = false;
        break;
      } else {
        success += resp.data.success_cnt;
        fail += resp.data.error_cnt;
      }
    } catch (err) {
      winston.warn('push: Error during SMS request:\n'+err);
      await LogService.addNotiFail('sms', '알리고 서버 요청 중 오류', targetUser);
      ok = false;
      break;
    }
  }
  if (ok) {
    await LogService.addNotiSend('sms', message, success, fail, targetUser);
  }
}

/**
 * 
 * @param users 수신자 FCM 토큰 목록
 * @param payload 발송 데이터
 * @param targetUser 로그에 표시할 수신자 텍스트
 */
export async function fcm(users: string[], payload: NotiPayload, targetUser: string) {
  if (users.length === 0) {
    return;
  }
  let success = 0, fail = 0;

  const clickURL = (await ConfigService.get(Config.FCM_URL_KEY)) ?? '';
  const tasks = users.map(x => x.trim())
    .filter(x => x !== '')
    .map(token => async () => {
      try {
        await firebase.messaging().send({
          data: {
            message: payload.message,
            title: payload.title,
            url: clickURL
          },
          token: token,
          apns: {
            payload: {
              aps: {
                alert: {
                  body: payload.message,
                  title: payload.title,
                },
                url: clickURL
              },
            }
          }
        });
        success++;
      } catch {
        fail++;
      }
    });
  await Promise.all(tasks);
  await LogService.addNotiSend('push', payload.message, success, fail, targetUser);
}
