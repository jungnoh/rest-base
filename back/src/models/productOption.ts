import { ProductOption } from "../../../common/models";
import mongo from "mongoose";
import { ObjectId } from "bson";

const schema = new mongo.Schema<ProductOption>({
  name: {required: true, type: String},
  originalPrice: {required: true, type: Number},
  price: {required: true, type: Number},
  stockCount: {required: true, type: Number}
});

const ProductOptionModel = mongo.model<ProductOption & mongo.Document>('ProductOption', schema);
export default ProductOptionModel;
