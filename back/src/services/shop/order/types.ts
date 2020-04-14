import { ObjectId } from 'bson';

export interface SearchOptions {
  user: ObjectId;
  startTime: Date;
  endTime: Date;
}

