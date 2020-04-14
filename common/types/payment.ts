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
  payMethod: 'samsung' | 'card' | 'trans' | 'vbank' | 'bank';
  // 결제 디바이스 (pc / mobile)
  channel: 'pc' | 'mobile' | 'unknown';
  detail: PaymentDetailBase;
}

interface PaymentBase {
  status: 'ready' | 'paid' | 'cancelled' | 'failed';
  // 주문 고유번호
  merchantUid: string;
  // 상품명
  name: string | null;
  // 결제금액
  amount: number;
  // 결제수단별 세부 결제정보
  desc: PaymentDescBase;
}

// 신용카드 (or 삼성페이) 결제 세부정보
interface CardDesc extends PaymentDescBase {
  payMethod: 'samsung' | 'card';
  // 아임포트 결제 고유번호
  impUid: string;
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

// 가상계좌 결제 세부정보
interface VBankDesc extends PaymentDescBase {
  payMethod: 'vbank';
  // 아임포트 결제 고유번호
  impUid: string;
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

// 실시간 무통장입금 결제 세부정보
interface TransDesc extends PaymentDescBase {
  payMethod: 'trans';
  // 아임포트 결제 고유번호
  impUid: string;
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

// 계좌이체 (아임포트 X) 결제 세부정보
interface BankDesc extends PaymentDescBase {
  payMethod: 'bank';
  detail: {
    // 은행명
    bankName: string;
    // 은행 계좌번호
    bankNum: string;
  } & PaymentDetailBase;
}

export type PaymentDesc = BankDesc | CardDesc | VBankDesc | TransDesc | BankDesc;
export type PendingDesc = ({payMethod: 'samsung' | 'card' | 'trans'} & PaymentDescBase) | VBankDesc | BankDesc;

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
