import { ObjectId } from 'bson';
import OrderModel from 'models/order';
import { ServiceResult } from 'util/types';
import { Order, OrderItem } from '../../../../common/models';

/**
 * @description 주문 객체를 가져옵니다.
 * @param id ObjectId
 */
export async function find(id: ObjectId):
ServiceResult<'ORDER_NEXIST', {order: Order; totalAmount: number}> {
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
