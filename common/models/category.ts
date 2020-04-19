import { ObjectId } from 'bson';

export default interface Category {
  ancestors: (Category | ObjectId)[];
  children: (Category | ObjectId)[];
  name: string;
  parent?: Category | ObjectId;
}