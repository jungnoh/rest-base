import { ObjectId } from 'bson';
import { Address, OrderItem } from '@common/models';

export interface SearchOptions {
  user: ObjectId;
  startTime: Date;
  endTime: Date;
}

export interface OrderItemCreationDesc {
  product: ObjectId;
  option: ObjectId;
  count: number;
  referral?: ObjectId;
}

export interface OrderCreationDesc {
  user: ObjectId;
  address: Address;
  items: OrderItemCreationDesc[];
}
