import { Order } from '@common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';
import addressSchema from './address';

const schema = new mongo.Schema<Order>({
  paymentAt: {default: null, required: false, type: Date},
  user: {ref: 'User', required: true, type: ObjectId},
  status: {
    enum: ['init', 'pending_payment', 'payment', 'preparing', 'sent', 'cancelled'],
    default: 'init',
    type: String
  },
  impPurchaseId: {required: false, type: String},
  payment: {required: false, any: Object},
  address: {
    required: true,
    type: addressSchema
  },
  packageId: {required: false, type: String},
  items: {
    default: [],
    type: [{type: ObjectId, ref: 'OrderItem'}],
  }
}, {
  timestamps: true
});

schema.index('user -createdAt');
schema.index('-createdAt');

export type OrderDoc = Order & mongo.TimestampedDocument;

const OrderModel = mongo.model<OrderDoc>('Order', schema);
export default OrderModel;
