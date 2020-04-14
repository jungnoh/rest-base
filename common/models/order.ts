import User from "./user";
import Address from "./address";
import OrderItem from "./orderItem";
import Payment from "../types/payment";
import { ObjectId } from "bson";

export enum OrderStatus {
  Init = 'init',
  PendingPayment = 'pending_payment',
  Payment = 'payment',
  Preparing = 'preparing',
  Sent = 'sent',
  Cancelled = 'cancelled'
}

/**
 * @description 주문 모델
 */
export default interface Order {
  // 주문일시
  createdAt: Date;
  // 결제완료 일시
  paymentAt?: Date;
  // 주문 사용자
  user: User | ObjectId;
  // 주문 상태
  status: OrderStatus;
  // 아임포트 결제 ID (payment null일 경우를 대비해 중복 기재)
  impPurchaseId?: string;
  // 결제 세부정보
  payment?: Payment;
  // 배송 주소지
  address: Address;
  // (택배 발송시) 송장번호
  packageId?: string;
  // 구매 제품
  items: OrderItem[];
}
