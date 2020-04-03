import { Referral } from '../../../common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<Referral>({
  hashId: {required: true, type: String},
  creator: {ref: 'User', required: true, type: ObjectId},
  product: {ref: 'Product', required: true, type: ObjectId},
  purchaseCount: {default: 0, required: true, type: Number},
  purchaseAmount: {default: 0, required: true, type: Number}
}, {timestamps: true});
schema.index('hashId');

const ReferralModel = mongo.model<Referral & mongo.TimestampedDocument>('Referral', schema);
export default ReferralModel;
