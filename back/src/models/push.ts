import { ObjectId } from 'bson';
import mongo from 'mongoose';
import Push from '../../../common/models/push';

const schema = new mongo.Schema({
  link: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  read: {
    default: false,
    required: true,
    type: Boolean,
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

schema.index('user -createdAt');

export const PushModel = mongo.model<Push & mongo.TimestampedDocument>('Push', schema);