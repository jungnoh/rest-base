/**
 * @description 주문 관리를 위한 기능을 제공합니다.
 */
import { ObjectId } from 'bson';
import OrderModel from 'models/order';
import { ServiceResult } from 'util/types';
import { OrderStatus } from '@common/models/order';

/**
 * @description `Payment` 상태의 주문을 `Preparing` 상태로 바꿉니다.
 * @param order 주문의 _id
 */
export async function setPreparing(order: ObjectId):
ServiceResult<'ORDER_NEXIST'|'STATUS_INVALID'> {
  const orderObj = await OrderModel.findById(order);
  if (!orderObj) {
    return {reason: 'ORDER_NEXIST', success: false};
  }
  if (orderObj.status !== OrderStatus.Payment) {
    return {reason: 'STATUS_INVALID', success: false};
  }
  orderObj.status = OrderStatus.Preparing;
  await orderObj.save();
  return {success: true};
}

/**
 * @description `Preparing` 상태의 주문을 `Sent` 상태로 바꿉니다.
 * @param order 주문의 _id
 * @param packageId 배송정보 (송장번호)
 */
export async function setSent(order: ObjectId, packageId: string):
ServiceResult<'ORDER_NEXIST'|'STATUS_INVALID'> {
  const orderObj = await OrderModel.findById(order);
  if (!orderObj) {
    return {reason: 'ORDER_NEXIST', success: false};
  }
  if (orderObj.status !== OrderStatus.Preparing) {
    return {reason: 'STATUS_INVALID', success: false};
  }
  orderObj.status = OrderStatus.Preparing;
  orderObj.packageId = packageId;
  await orderObj.save();
  return {success: true};
}
