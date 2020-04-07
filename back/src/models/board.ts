import { Board } from '../../../common/models';
import mongo from 'mongoose';

const schema = new mongo.Schema<Board>({
  key: {required: true, type: String, unique: true},
  showComments: {default: false, required: true, type: Boolean},
  showCommentRatings: {default: false, required: true, type: Boolean},
  limitWriteToAdmin: {default: true, required: true, type: Boolean}
});

const BoardModel = mongo.model<Board & mongo.Document>('Board', schema);
export default BoardModel;
