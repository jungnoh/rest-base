import Address from "./address";

export enum UserType {
  Member = 'member',  // 일반 회원
  Partner = 'partner' // 파트너 회원
}


export interface UserProfile {
  // SMS 수신여부
  allowSMS: boolean;
  // 푸쉬알림 수신여부
  allowPush: boolean;
  // 주소
  address: Address;
  // 이메일
  email: string;
  // 이름
  name: string;
  // 전화번호
  phone: string;

}

export interface UserSignup extends UserProfile {
  // 사용자명
  username: string;
  // 비밀번호 (해시)
  password: string;
  // 아임포트 본인인증 키
  impIdentityKey: string;
}

/**
 * @description 사용자 모델
 */
export default interface User extends UserSignup {
  // pk
  id: number;
  // 생성일자
  createdAt: Date;
  // 관리자 수준
  adminLevel: number;
  // 사용자 등급
  level: number;
  // 사용자 종류
  type: UserType;
  // 잔액
  balance: number;
  // 유저별 랜딩페이지 JSON
  landingPage: string; 
  // 사용자 활성화 여부
  active: boolean;
}