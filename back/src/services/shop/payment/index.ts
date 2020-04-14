import Payment from '@common/types/payment';

/**
 * @description 계좌이체에 대한 Payment 객체를 생성합니다.
 * @param payload 계좌이체 관련 정보
 */
export async function createBankPayment(payload: {
  id: string,
  amount: number,
  bankName: string,
  bankNum: string
}): Promise<Payment> {
  return {
    status: 'ready',
    merchantUid: payload.id,
    amount: payload.amount,
    name: null,
    desc: {
      payMethod: 'bank',
      channel: 'unknown',
      detail: {
        issueCashReceipt: false,
        startTime: new Date(),
        bankName: payload.bankName,
        bankNum: payload.bankNum,
      }
    }
  };
}
