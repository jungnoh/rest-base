import { ObjectId } from 'bson';
import OrderModel, { OrderDoc } from 'models/order';
import { ServiceResult } from 'util/types';
import { OrderItem } from '@common/models';

/**
 * @description 주문 객체를 가져옵니다.
 * @param id ObjectId
 */
export async function findById(id: ObjectId):
ServiceResult<'ORDER_NEXIST', {order: OrderDoc; totalAmount: number}> {
  const order = await OrderModel.findById(id).populate('address items user');
  if (!order) {
    return {reason: 'ORDER_NEXIST', success: false};
  }
  const totalAmount = (order.items as OrderItem[]).reduce((p, c)=> (p + (c.itemPrice * c.count)), 0);
  return {
    result: {
      order,
      totalAmount
    },
    success: true
  };
}
