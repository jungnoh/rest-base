import { Board } from "../../../common/models";
import mongo from "mongoose";
import { ObjectId } from "bson";

const schema = new mongo.Schema<Board>({
  key: {required: true, type: String, unique: true},
  showComments: {default: false, required: true, type: Boolean},
  showCommentRatings: {default: false, required: true, type: Boolean}
});

const BoardModel = mongo.model<Board & mongo.Document>('Board', schema);
export default BoardModel;
