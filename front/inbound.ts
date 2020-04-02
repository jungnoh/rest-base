import { CampaignLog, InboundLog } from "../common/models";
import mongo from "mongoose";
import { ParseResult } from "req-meta-middleware/dist/types";

const inboundSchema = new mongo.Schema<InboundLog>({
  date: {required: true, type: Date},
  type: {required: true, type: String},
  method: {required: true, type: String},
  count: {default: 0, required: true, type: Number}
});
const campaignSchema = new mongo.Schema<CampaignLog>({
  type: {required: true, type: String},
  method: {required: true, type: String},
  searchTerm: {required: false, type: String},
  ip: {required: true, type: String},
  country: {required: false, type: String},
  region: {required: false, type: String},
}, {timestamps: true});

const InboundLogModel = mongo.model<InboundLog & mongo.Document>('InboundLog', inboundSchema);
const CampaignLogModel = mongo.model<CampaignLog & mongo.Document>('CampaignLog', campaignSchema);

const VALID_URLS = [/^\/$/];

export function writeRecord(meta: ParseResult) {
  if (['unknown', 'internal'].includes(meta.referrer.medium) || !(VALID_URLS.some(v => v.exec(meta.url.pathname ?? '')))) {
    return;
  }
  if (['social', 'search', 'link'].includes(meta.referrer.medium)) {
    const query = meta.referrer.params.map(x => x.value).join(' / ');
    CampaignLogModel.create({
      url: meta.referrerUrl.href,
      type: meta.referrer.medium,
      method: meta.referrer.siteName,
      term: query,
      ip: meta.ip?.ip,
      country: meta.ip?.geo?.country,
      region: meta.ip?.geo?.region
    }).then(() => {});
  }
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  InboundLogModel.findOneAndUpdate(
    {
      type: meta.referrer.medium,
      method: meta.referrer.siteName,
      date: day
    },
    {$inc: {count: 1}},
    {upsert: true}
  ).then(() => {});
}
