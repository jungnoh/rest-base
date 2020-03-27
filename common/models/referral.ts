import User from "./user";
import Product from "./product";

/**
 * @description 리퍼럴 모델
 */
export default interface Referral {
  // pk
  id: number;
  // 해시 ID (URL에 사용)
  hashId: string;
  // 생성일시
  createdAt: Date;
  // 소유자
  creator?: User;
  // 연결 제품
  product?: Product;
  // 구매 개수
  purchaseCount: number;
  // 구매 총 금액
  purchaseAmount: number;
}