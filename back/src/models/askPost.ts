import { AskPost, User } from '../../../common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<AskPost>({
  author: {ref: 'User', required: true, type: ObjectId},
  answeredAt: {type: Date, required: false},
  title: {required: true, type: String},
  content: {required: true, type: String},
  answerContent: {required: false, type: String},
  answered: {default: false, required: true, type: String}
}, {timestamps: true});

schema.index('author -createdAt');

const AskPostModel = mongo.model<AskPost & mongo.TimestampedDocument>('AskPost', schema);
export default AskPostModel;
