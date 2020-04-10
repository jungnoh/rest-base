import { ObjectId } from 'bson';
import mongo from 'mongoose';
import { User } from '../../../common/models';

export interface File {
  medium: 'local' | 's3';
  expose: boolean;
  owner: User | ObjectId;
  filename?: string;
  type: string;
  createdAt: Date;
  key: string;
}

export type FileDoc = File & mongo.TimestampedDocument;

const schema = new mongo.Schema<File>({
  medium: {default: 'local', enum: ['local', 's3'], type: String},
  expose: {default: false, required: true, type: Boolean},
  owner: {ref: 'User', required: true, type: ObjectId},
  filename: {required: false, type: String},
  type: {required: true, type: String},
  key: {required: true, type: String}
}, {timestamps: true});

const FileModel = mongo.model<FileDoc>('File', schema);
export default FileModel;
