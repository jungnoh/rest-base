import { Order } from '../../../common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<Order>({
  paymentAt: {default: null, required: false, type: Date},
  user: {ref: 'User', required: true, type: ObjectId},
  status: {
    enum: ['pending_payment', 'preparing', 'sent', 'cancelled'],
    default: 'pending_payment',
    type: String
  },
  paymentType: {
    enum: ['credit', 'transfer', 'none'],
    required: true,
    type: String
  },
  impPurchaseId: {required: false, type: String},
  address: {
    ref: 'Address',
    required: true,
    type: ObjectId
  },
  packageId: {
    required: false,
    type: String
  },
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
