/**
 * @description 주문의 결제 관련 서비스를 제공합니다.
 */
import { ObjectId } from 'bson';
import { ServiceResult } from 'util/types';
import * as IMPService from '../payment/iamport';
import { OrderStatus } from '@common/models/order';
import { findById } from '.';
import { createBankPayment } from '../payment';
import OrderModel from 'models/order';

/**
 * @description 주문에 대한 결제가 완료되었는지 확인하고, 주문이 Init 또는 PendingPayment 상태라면 Payment로 상태를 변경합니다.
 * 주문의 payment 정보는 업데이트 합니다. 주문 상태가 Init인데 결제가 되지 않았다면 PendingPayment로 상태를 변경합니다.
 * @param id 주문의 _id
 * @param impKey 아임포트 키. 주어질 경우 해당 키로 주문의 키를 업데이트하며, 없을 경우 주문에 저장된 키를 사용합니다.
 */
export async function checkImpPaymentCompletion(id: ObjectId, impKey?: string):
ServiceResult<'ORDER_NEXIST'|'IMP_INVALID', {paid: boolean, statusUpdated: boolean}> {
  const orderInfo = await findById(id);
  if (!orderInfo.success) {
    return {reason: 'ORDER_NEXIST', success: false};
  }
  const {order, totalAmount} = orderInfo.result!;
  if (!order.impPurchaseId) {
    return {result: {paid: false, statusUpdated: false}, success: true};
  }
  const checkResult = await IMPService.checkPayment(impKey ?? order.impPurchaseId, totalAmount);
  if (!checkResult.success) {
    return {reason: 'IMP_INVALID', success: false};
  }
  if (impKey) {
    order.impPurchaseId = impKey;
  }
  const paid = checkResult.result!.paid;
  let statusUpdated = false;
  if (checkResult.result!.payment) {
    order.payment = checkResult.result!.payment;
  }
  if (paid && (order.status === OrderStatus.PendingPayment || order.status === OrderStatus.Init)) {
    order.status = OrderStatus.Payment;
    statusUpdated = true;
  }
  if (!paid && order.status === OrderStatus.Init) {
    order.status = OrderStatus.PendingPayment;
    statusUpdated = true;
  }
  await order.save();
  return {result: {paid, statusUpdated}, success: true};
}

/**
 * @description 아임포트 결제키를 주문에 등록합니다. 주문을 등록하고, 주문상태와 payment 필드를 업데이트 합니다.
 */
export async function setImpPurchaseId(order: ObjectId, impKey: string):
ServiceResult<'ORDER_NEXIST'|'IMP_INVALID'> {
  const orderResult = await checkImpPaymentCompletion(order, impKey);
  if (!orderResult.success) {
    return {reason: orderResult.reason, success: false};
  }
  return {success: true};
}

/**
 * @description 무통장 입금을 주문에 등록합니다. 주문의 상태 또한 PendingPayment로 변경합니다.
 */
export async function setBankPurchase(order: ObjectId, payload: {
  id: string,
  amount: number,
  bankName: string,
  bankNum: string
}): ServiceResult<'ORDER_NEXIST'> {
  const updateInfo = await OrderModel.findOneAndUpdate(order, {
    payment: await createBankPayment(payload),
    status: OrderStatus.PendingPayment
  });
  if (!updateInfo) {
    return {reason: 'ORDER_NEXIST', success: false};
  } else {
    return {success: true};
  }
}