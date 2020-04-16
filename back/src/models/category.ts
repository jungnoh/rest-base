import { ObjectId } from 'bson';
import { Category } from '@common/models';
import mongo from 'mongoose';

const schema = new mongo.Schema<Category>({
  children: {
    default: [],
    required: true,
    type: [{ref: 'Category', type: ObjectId}]
  },
  name: {
    required: true,
    type: String
  },
  parent: {
    ref: 'Category',
    type: ObjectId
  }
});

export type CategoryDoc = Category & mongo.Document;

const CategoryModel = mongo.model<CategoryDoc>('Category', schema);
export default CategoryModel;
