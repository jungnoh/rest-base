/* eslint-disable @typescript-eslint/camelcase */
/**
 * @description 아임포트 API에 접근하는 서비스를 제공합니다.
 */
import { ObjectId } from 'bson';
import winston from 'winston';
import { ServiceResult } from 'util/types';
import Payment from '@common/types/payment';
import { checkImpPaymentCompletion } from '../order/payment';
import { getImpPurchase } from 'services/core/iamport';

export interface PaymentInfo {
  impUid: string;
  orderId: ObjectId;
  valid: boolean;
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
    const payResult = await checkImpPaymentCompletion(new ObjectId(merchantUid), impUid);
    if (!payResult.success) {
      return {reason: payResult.reason, success: false};
    }
    return {success: true};
  }
  winston.warn(`imp webhook: Unhandled status 'cancelled' (imp_uid ${impUid}, merchant_uid ${merchantUid})`);
  return {success: true};
}
