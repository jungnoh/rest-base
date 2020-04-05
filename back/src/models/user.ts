import { User } from '../../../common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<User>({
  allowSMS: {default: true, required: true, type: Boolean},
  allowPush: {default: true, required: true, type: Boolean},
  address: {ref: 'Address', required: true, type: ObjectId},
  email: {required: true, type: String},
  name: {required: true, type: String},
  phone: {required: true, type: String},
  username: {required: true, type: String},
  password: {required: true, type: String},
  impIdentityKey: {required: true, type: String},
  adminLevel: {default: 0, required: true, type: Number},
  level: {default: 0, required: true, type: Number},
  type: {default: 'member', enum: ['member', 'partner'], required: true, type: String},
  balance: {default: 0, required: true, type: Number},
  landingPage: {default: '{}', required: true, type: String},
  active: {default: false, required: true, type: Boolean},
  fcmToken: {required: false, type: String}
});
schema.index('username');

const UserModel = mongo.model<User & mongo.TimestampedDocument>('User', schema);
export default UserModel;
