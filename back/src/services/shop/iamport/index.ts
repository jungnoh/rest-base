/* eslint-disable @typescript-eslint/camelcase */
/**
 * @description 아임포트 API에 접근하는 서비스를 제공합니다.
 */
import axios from 'axios';
import { ObjectId } from 'bson';
import winston from 'winston';
import * as AuthService from 'services/auth';
import * as ConfigService from 'services/core/config';
import { ServiceResult } from 'util/types';
import parsePayment from './parse';
import Payment from '@common/types/payment';
import { checkPaymentCompletion } from '../order/payment';

const CONFIG_IMP_KEY = 'IMP_API_KEY';
const CONFIG_IMP_SECRET = 'IMP_API_SECRET'; 

export interface UserAuthInfo {
  // 이전에 본 사이트에 가입된 사용자인지 (`uniqueId`로 판별)
  isUnique: boolean;
  // 이름
  name: string;
  // 아임포트 사용자 고유 식별자. https://docs.iamport.kr/tech/mobile-authentication
  uniqueId: string;
}

export interface PaymentInfo {
  impUid: string;
  orderId: ObjectId;
  valid: boolean;
}

// Do not use these on its own
let _token = '';
let _tokenExpiryTime = 0;

async function getToken(): Promise<string> {
  const impKey = (await ConfigService.get(CONFIG_IMP_KEY)) ?? '';
  const impSecret = (await ConfigService.get(CONFIG_IMP_SECRET)) ?? '';
  if (Date.now()/1000 + 10 < _tokenExpiryTime) {
    return _token;
  }
  winston.debug('Refreshing iamport token');
  const resp = await axios.post('https://api.iamport.kr/users/getToken', {
    imp_key: impKey,
    imp_secret: impSecret
  });
  _token = resp.data.response.access_token;
  _tokenExpiryTime = resp.data.response.expired_at;
  return _token;
}

export async function init(): Promise<string[]> {
  try {
    await getToken();
  } catch (err) {
    winston.error('imp: Failed to refresh token');
    winston.error(err);
  }
  return [CONFIG_IMP_KEY, CONFIG_IMP_SECRET];
}

/**
 * @description 프런트엔드에서 완료한 문자인증을 검증합니다.
 * @param uid 프런트엔드에서 문자인증 후 받은 인증정보
 * @param phone 프론트엔드에서 문자인증에서 사용한 전화번호
 * @returns 검증 실패하거나 완료되지 않은 문자일 경우 `undefined`, 성공하였을 경우 해당 정보
 */
export async function checkCertificate(uid: string, phone: string): Promise<UserAuthInfo | undefined> {
  const iamToken = await getToken();
  const resp = await axios.get(
    `https://api.iamport.kr/certifications/${uid}`,
    {
      headers: { 'Authorization': iamToken },
      validateStatus: (n) => (n === 200 || n === 404)
    }
  );
  if (resp.status === 404) {
    return undefined;
  }
  const certInfo = resp.data.response;
  const uniqueKey = certInfo.unique_key;
  const isUnique = !(await AuthService.checkIamKeyExists(uniqueKey, phone));
  return {
    isUnique,
    name: certInfo.name,
    uniqueId: uniqueKey 
  };
}

/**
 * @description 아임포트 결제 정보를 가져옵니다.
 * @param impUid 아임포트 uid
 */
export async function getImpPurchase(impUid: string): Promise<Payment | undefined> {
  const iamToken = await getToken();
  const resp = await axios.get(
    `https://api.iamport.kr/payments/${impUid}`,
    {
      headers: { 'Authorization': iamToken },
      validateStatus: (n) => (n === 200 || n === 404)
    }
  );
  if (resp.status === 404) {
    return undefined;
  }
  return parsePayment(resp.data.response);
}

/**
 * @description 결제 금액과 비교해 결제가 완료되었는지 확인합니다.
 */
export async function checkPayment(impUid: string, amount: number):
ServiceResult<'IMP_INVALID', {payment: Payment; paid: boolean}> {
  const impPurchase = await getImpPurchase(impUid);
  if (!impPurchase) {
    return {
      reason: 'IMP_INVALID',
      success: false
    };
  }
  const paid = impPurchase.status === 'paid' && impPurchase.amount === amount;
  return {
    result: {
      payment: impPurchase,
      paid
    },
    success: true
  };
}

/**
 * @description 아임포트의 웹훅 요청을 처리합니다.
 * @param impUid 웹훅 요청의 `imp_uid`
 * @param merchantUid 웹훅 요청의 `merchant_uid`
 * @see https://docs.iamport.kr/tech/webhook
 */
export async function handleWebhook(impUid: string, merchantUid: string, status: 'ready'|'paid'|'failed'|'cancelled'):
ServiceResult<'MERCHANT_INVALID'|'ORDER_NEXIST'|'IMP_INVALID'> {
  try {
    new ObjectId(merchantUid);
  } catch {
    return {reason: 'MERCHANT_INVALID', success: false};
  }
  if (status === 'ready' || status === 'paid' || status === 'failed') {
    const payResult = await checkPaymentCompletion(new ObjectId(merchantUid), impUid);
    if (!payResult.success) {
      return {reason: payResult.reason, success: false};
    }
    return {success: true};
  }
  winston.warn(`imp webhook: Unhandled status 'cancelled' (imp_uid ${impUid}, merchant_uid ${merchantUid})`);
  return {success: true};
}
