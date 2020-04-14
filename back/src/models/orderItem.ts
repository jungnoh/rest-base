import { OrderItem } from '@common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<OrderItem>({
  count: {default: 1, type: Number},
  itemPrice: {required: true, type: Number},
  product: {ref: 'Product', required: true, type: ObjectId},
  productName: {required: true, type: String},
  option: {ref: 'Option', required: true, type: ObjectId},
  optionName: {required: true, type: String},
  referral: {ref: 'Referral', required: false, type: ObjectId}
});

export type OrderItemDoc = OrderItem & mongo.TimestampedDocument;

const OrderItemModel = mongo.model<OrderItemDoc>('OrderItem', schema);
export default OrderItemModel;
