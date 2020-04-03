import mongoose from 'mongoose';

export interface Config {
  key: string;
  value: string;
}

const schema = new mongoose.Schema({
  key: {
    required: true,
    type: String
  },
  value: {
    default: '',
    required: true,
    type: String
  }
}, {timestamps: true});

export const ConfigModel = mongoose.model<Config & mongoose.TimestampedDocument>('Config', schema);
