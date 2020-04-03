import { Address } from '../../../common/models';
import mongo from 'mongoose';

const schema = new mongo.Schema<Address>({
  name: {required: true, type: String},
  phone: {required: true, type: String},
  address1: {required: true, type: String},
  address2: {type: String},
  postalCode: {required: true, type: String}
});

const AddressModel = mongo.model<Address & mongo.Document>('Address', schema);
export default AddressModel;
