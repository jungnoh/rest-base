/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';
import winston from 'winston';
import * as AuthService from 'services/auth';
import * as ConfigService from 'services/core/config';

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

