import { ObjectId } from 'bson';

export default interface Category {
  children: (Category | ObjectId)[];
  name: string;
  parent?: Category | ObjectId;
}