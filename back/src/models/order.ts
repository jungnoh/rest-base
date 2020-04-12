import { Order } from '@common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

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
    ref: 'Address',
    required: true,
    type: ObjectId
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

const OrderModel = mongo.model<Order & mongo.TimestampedDocument>('Order', schema);
export default OrderModel;
