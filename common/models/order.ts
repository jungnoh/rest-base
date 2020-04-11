import User from "./user";
import Address from "./address";
import OrderItem from "./orderItem";

export enum OrderStatus {
  PendingPayment = 'pending_payment',
  Preparing = 'preparing',
  Sent = 'sent',
  Cancelled = 'cancelled'
}

export enum PaymentType {
  Credit = 'credit',
  Transfer = 'transfer',
  None = 'none'
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
  user: User;
  // 주문 상태
  status: OrderStatus;
  // 결제 수단
  paymentType: PaymentType;
  // 아임포트 결제 ID
  impPurchaseId?: string;
  // 배송 주소지
  address: Address;
  // (택배 발송시) 송장번호
  packageId?: string;
  // 구매 제품
  items: OrderItem[];
}
