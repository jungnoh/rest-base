interface PaymentDetailBase {
  // 현금영수증 발행여부
  issueCashReceipt: boolean;
  // 결제 시작일시
  startTime: Date;
  // 결제 완료일시
  paymentTime?: Date;
}

interface PaymentDescBase {
  // 겔제수단
  payMethod: 'samsung' | 'card' | 'trans' | 'vbank';
  // 결제 디바이스 (pc / mobile)
  channel: 'pc' | 'mobile';
  detail: PaymentDetailBase;
}

interface PaymentBase {
  status: 'ready' | 'paid' | 'cancelled' | 'failed';
  // 아임포트 결제 고유번호
  impUid: string;
  // 주문 고유번호
  merchantUid: string;
  // 상품명
  name: string | null;
  // 결제금액
  amount: number; 
  // 결제 화폐단위
  currency: string;
  // 결제수단별 세부 결제정보
  desc: PaymentDescBase;
}

interface CardDesc extends PaymentDescBase {
  payMethod: 'samsung' | 'card';
  detail: {
    // 카드 승인번호
    applyNum: string;
    // 카드사 명칭
    cardCode: string;
    // 카드 회사명
    cardName: string;
    // 카드번호
    cardNumber: string;
    // 카드 할부 개월 수 (일시불시 0)
    cardQuota: string;
    // PG사
    pgProvider: string;
    // PG사 승인정보
    pgCode: string;
  } & PaymentDetailBase;
}

interface VBankDesc extends PaymentDescBase {
  payMethod: 'vbank';
  detail: {
    // 가상계좌 은행 코드
    vBankCode: string;
    // 가상계좌 입금 마감일자
    vBankEndDate: Date;
    // 가상계좌 예금주
    vBankHolder: string;
    // 가상계좌 은행명
    vBankName: string;
    // 가상계좌 계좌번호
    vBankNum: string;
    // PG사
    pgProvider: string;
    // PG사 승인정보
    pgCode: string;
  } & PaymentDetailBase;
}

interface TransDesc extends PaymentDescBase {
  payMethod: 'trans';
  detail: {
    // 은행코드
    bankCode: string;
    // 은행명
    bankName: string;
    // PG사
    pgProvider: string;
    // PG사 승인정보
    pgCode: string;
  } & PaymentDetailBase;
}

export type PaymentDesc = CardDesc | VBankDesc | TransDesc;
export type PendingDesc = ({payMethod: 'samsung' | 'card' | 'trans'} & PaymentDescBase) | VBankDesc;

interface ReadyPayment extends PaymentBase {
  status: 'ready';
  desc: PendingDesc;
}

interface PaidPayment extends PaymentBase {
  status: 'paid',
  desc: PaymentDesc;
}

interface FailedPayment extends PaymentBase {
  status: 'failed';
  desc: PendingDesc & {
    failReason: string;
    failTime: Date;
  };
}

interface CancelledPayment extends PaymentBase {
  status: 'cancelled';
  desc: PaymentDesc & {
    cancelTime: Date;
    cancelAmount: number;
  };
}

type Payment = ReadyPayment | PaidPayment | FailedPayment | CancelledPayment;
export default Payment;
