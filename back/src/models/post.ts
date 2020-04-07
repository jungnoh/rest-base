import mongo from 'mongoose';
import { ObjectId } from 'bson';
import { Post } from '../../../common/models';

const schema = new mongo.Schema<Post>({
  board: {ref: 'Board', required: true, type: ObjectId},
  title: {required: true, type: String},
  content: {required: true, type: String},
  author: {ref: 'User', required: true, type: ObjectId},
  view: {default: 0, required: true, type: Number}
}, {timestamps: true});

schema.index('board -createdAt');

const PostModel = mongo.model<Post & mongo.TimestampedDocument>('Post', schema);
export default PostModel;
