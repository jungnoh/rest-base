import Address from "./address";

export enum UserType {
  Member,  // 일반 회원
  Partner  // 파트너 회원
}

/**
 * @description 사용자 모델
 */
export default interface User {
  // pk
  id: number;
  // 생성일자
  createdAt: Date;
  // 사용자명
  username: string;
  // 비밀번호 (해시)
  password: string;
  // 이메일
  email: string;
  // 관리자 수준
  adminLevel: number;
  // 사용자 등급
  level: number;
  // 사용자 종류
  type: UserType;
  // SMS 수신여부
  allowSMS: boolean;
  // 푸쉬알림 수신여부
  allowPush: boolean;
  // 주소
  address: Address;
  // 잔액
  balance: number;
  // 유저별 랜딩페이지 JSON
  landingPage: string; 
}