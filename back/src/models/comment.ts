import Comment from '../../../common/models/comment';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<Comment>({
  author: {required: true, type: ObjectId, ref: 'User'},
  content: {required: true, type: String},
  rating: {default: 0, required: true, type: Number}
}, {timestamps: true});

const CommentModel = mongo.model<Comment & mongo.TimestampedDocument>('Comment', schema);
export default CommentModel;
