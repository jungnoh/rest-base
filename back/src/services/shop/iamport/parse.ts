/**
 * @description 아임포트 API의 요청을 파싱합니다.
 */
import Payment, { PaymentDesc, PendingDesc } from '@common/types/payment';

function paymentDesc(resp: any): PaymentDesc {
  const payMethod = resp.pay_method as 'samsung' | 'card' | 'trans' | 'vbank';
  const payChannel = resp.channel as 'pc' | 'mobile';
  if (payMethod === 'vbank') {
    return {
      payMethod: 'vbank',
      channel: payChannel,
      detail: {
        vBankCode: resp.vbank_code,
        vBankEndDate: new Date(resp.vbank_date*1000),
        vBankHolder: resp.vbank_holder,
        vBankName: resp.vbank_name,
        vBankNum: resp.vbank_num,
        pgProvider: resp.pg_provider,
        pgCode: resp.pg_tid,
        startTime: new Date(resp.started_at*1000),
        issueCashReceipt: resp.cash_receipt_issued,
        paymentTime: new Date(resp.paid_at*1000)
      }
    };
  }
  if (payMethod === 'trans') {
    return {
      payMethod: 'trans',
      channel: payChannel,
      detail: {
        bankCode: resp.bank_code,
        bankName: resp.bank_name,
        pgProvider: resp.pg_provider,
        pgCode: resp.pg_tid,
        startTime: new Date(resp.started_at*1000),
        issueCashReceipt: resp.cash_receipt_issued,
        paymentTime: new Date(resp.paid_at*1000)
      }
    };
  }
  return {
    payMethod,
    channel: payChannel,
    detail: {
      applyNum: resp.apply_num,
      cardCode: resp.card_code,
      cardName: resp.card_name,
      cardNumber: resp.card_number,
      cardQuota: resp.card_quota,
      pgProvider: resp.pg_provider,
      pgCode: resp.pg_tid,
      startTime: new Date(resp.started_at*1000),
      issueCashReceipt: resp.cash_receipt_issued,
      paymentTime: new Date(resp.paid_at*1000)
    }
  };
}

function pendingDesc(resp: any): PendingDesc {
  const payMethod = resp.pay_method as 'samsung' | 'card' | 'trans' | 'vbank';
  const payChannel = resp.channel as 'pc' | 'mobile';
  if (payMethod === 'vbank') {
    return {
      payMethod: 'vbank',
      channel: payChannel,
      detail: {
        vBankCode: resp.vbank_code,
        vBankEndDate: new Date(resp.vbank_date*1000),
        vBankHolder: resp.vbank_holder,
        vBankName: resp.vbank_name,
        vBankNum: resp.vbank_num,
        pgProvider: resp.pg_provider,
        pgCode: resp.pg_tid,
        startTime: new Date(resp.started_at*1000),
        issueCashReceipt: resp.cash_receipt_issued
      }
    };
  }
  return {
    payMethod,
    channel: payChannel,
    detail: {
      startTime: new Date(resp.started_at*1000),
      issueCashReceipt: resp.cash_receipt_issued
    }
  };
}

/**
 * 
 * @param result 아임포트 응답의 `response` 객체
 */
export default function parsePayment(resp: any): (Payment | undefined) {
  const status = resp.status as 'ready' | 'paid' | 'cancelled' | 'failed';
  const retBase = {
    impUid: resp.imp_uid,
    merchantUid: resp.merchant_uid,
    name: resp.name,
    amount: resp.amount,
    currency: resp.currency
  };
  if (status === 'paid') {
    return Object.assign(retBase, {
      status: 'paid' as 'paid',
      desc: paymentDesc(resp)
    });
  }
  if (status === 'ready') {
    return Object.assign(retBase, {
      status: 'ready' as 'ready',
      desc: pendingDesc(resp)
    });
  }
  if (status === 'failed') {
    return Object.assign(retBase, {
      status: 'failed' as 'failed',
      desc: Object.assign(pendingDesc(resp), {
        failReason: resp.fail_reason,
        failTime: new Date(resp.failed_at*1000)
      })
    });
  }
  if (status === 'cancelled') {
    return Object.assign(retBase, {
      status: 'cancelled' as 'cancelled',
      desc: Object.assign(paymentDesc(resp), {
        cancelTime: new Date(resp.cancelled_at*1000),
        cancelAmount: resp.cancel_amount
      })
    });
  }
}