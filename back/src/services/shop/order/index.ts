import { ObjectId } from 'bson';
import OrderModel, { OrderDoc } from 'models/order';
import { ServiceResult } from 'util/types';
import { OrderItem } from '@common/models';
import { DOCS_PER_PAGE } from 'constant';
import { SearchOptions } from './types';

/**
 * @description 주문 객체를 가져옵니다.
 * @param id ObjectId
 */
export async function findById(id: ObjectId):
ServiceResult<'ORDER_NEXIST', {order: OrderDoc; totalAmount: number}> {
  const order = await OrderModel.findById(id).populate('items user');
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

/**
 * @description 주문 목록을 가져옵니다.
 * @param options 필터 옵션
 * @param page 페이지
 * @param limit 페이지당 표시 개수
 */
export async function list(options?: Partial<SearchOptions>, page = 1, limit = DOCS_PER_PAGE) {
  let query = OrderModel.find();
  if (options) {
    if (options.user) {
      query = query.find({user: options.user});
    }
    if (options.startTime) {
      query = query.find({createdAt: {$gte: options.startTime}});
    }
    if (options.endTime) {
      query = query.find({createdAt: {$lte: options.endTime}});
    }
  }
  query = query.sort('-createdAt');
  if (page > 1) {
    query = query.skip(limit * (page - 1));
  }
  await query.limit(limit).populate('items');
}
