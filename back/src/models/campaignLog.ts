import CampaignLog from "../../../common/models/campaignLog";
import mongo from "mongoose";

const schema = new mongo.Schema<CampaignLog>({
  type: {required: true, type: String},
  method: {required: true, type: String},
  searchTerm: {required: false, type: String},
  ip: {required: true, type: String},
  country: {required: false, type: String},
  region: {required: false, type: String},
}, {timestamps: true});

const CampaignLogModel = mongo.model<CampaignLog & mongo.TimestampedDocument>('CampaignLog', schema);
export default CampaignLogModel;
