import { ObjectId } from 'bson';
import { OrderItem } from '@common/models';
import { DOCS_PER_PAGE } from 'constant';
import OrderModel, { OrderDoc } from 'models/order';
import OrderItemModel, { OrderItemDoc } from 'models/orderItem';
import ProductModel from 'models/product';
import ProductOptionModel from 'models/productOption';
import ReferralModel from 'models/referral';
import * as IMPService from 'services/shop/payment/iamport';
import { ServiceResult } from 'util/types';
import { SearchOptions, OrderCreationDesc, OrderItemCreationDesc } from './types';

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

/**
 * @description 새로운 주문 항목을 생성합니다.
 * @param payload OrderItem 생성을 위한 정보
 */
export async function createOrderItem(payload: OrderItemCreationDesc):
ServiceResult<'PRODUCT_NEXIST'|'OPTION_NEXIST'|'REFERRAL_NEXIST', OrderItemDoc> {
  let orderItem: Partial<OrderItem> = {
    count: payload.count,
    product: payload.product,
    option: payload.option
  };
  const productObj = await ProductModel.findById(payload.product).select('title');
  if (!productObj) {
    return {reason: 'PRODUCT_NEXIST', success: false};
  }
  const optionObj = await ProductOptionModel.findById(payload.option).select('name price');
  if (!optionObj) {
    return {reason: 'OPTION_NEXIST', success: false};
  }
  orderItem = Object.assign(orderItem, {
    product: payload.product,
    productName: productObj.title,
    option: payload.option,
    optionName: optionObj.name,
    itemPrice: optionObj.price
  });
  if (payload.referral) {
    const referralObj = await ReferralModel.findById(payload.referral);
    if (!referralObj) {
      return {reason: 'REFERRAL_NEXIST', success: false};
    }
    orderItem.referral = payload.referral;
  }
  const orderItemDoc = await OrderItemModel.create(orderItem);
  return {result: orderItemDoc, success: true};
}

/**
 * @description 새로운 주문을 생성합니다.
 * @param payload 주문 생성을 위한 정보
 */
export async function createOrder(payload: OrderCreationDesc):
ServiceResult<'PRODUCT_NEXIST'|'OPTION_NEXIST'|'REFERRAL_NEXIST', OrderDoc> {
  const orderItems: OrderItemDoc[] = [];
  const revertOrderItems = async () => {
    // Delete all created order items
    for (const item of orderItems) {
      await item.remove();
    }
  };
  for (const item of payload.items) {
    const newItem = await createOrderItem(item);
    if (!newItem.success) {
      await revertOrderItems();
      return {reason: newItem.reason, success: false};
    } else {
      orderItems.push(newItem.result!);
    }
  }
  const newOrder = await OrderModel.create({
    address: payload.address,
    items: orderItems,
    status: 'init',
    user: payload.user
  });
  return {result: newOrder, success: true};
}
