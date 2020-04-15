import { Product } from '../../../common/models';
import mongo from 'mongoose';
import { ObjectId } from 'bson';

const schema = new mongo.Schema<Product>({
  type: {enum: ['item', 'service'], required: true, type: String},
  title: {required: true, type: String},
  description: {required: true, type: String},
  basePrice: {required: true, type: Number},
  display: {default: false, required: true, type: Boolean},
  options: {
    default: [],
    required: true,
    type: [{ref: 'ProductOption', required: true, type: ObjectId}]
  }
});

export type ProductDoc = Product & mongo.Document;

const ProductModel = mongo.model<ProductDoc>('Product', schema);
export default ProductModel;
