import { InboundLog } from '../../../common/models';
import mongo from 'mongoose';

const schema = new mongo.Schema<InboundLog>({
  date: {required: true, type: Date},
  type: {required: true, type: String},
  method: {required: true, type: String},
  count: {default: 0, required: true, type: Number}
});

const InboundLogModel = mongo.model<InboundLog & mongo.Document>('InboundLog', schema);
export default InboundLogModel;
