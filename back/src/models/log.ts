import mongoose from 'mongoose';

export interface Log {
  targetUser: string;
  message: string;
  type: string;
  detail: string;
  createdAt: Date;
}

const schema = new mongoose.Schema({
  detail: {
    required: true,
    type: String
  },
  message: {
    required: true,
    type: String
  },
  targetUser: {
    default: '',
    type: String
  },
  type: {
    required: true,
    type: String
  }
}, {
  timestamps: true
});

schema.index({'createdAt': -1});

export const LogModel = mongoose.model<Log & mongoose.TimestampedDocument>('Log', schema);
