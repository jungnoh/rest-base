import { ObjectId } from 'bson';
import { User } from '.';

export default interface Push {
  message: string;
  title: string;
  link: string;
  read: boolean;
  createdAt: Date;
  user: ObjectId | User;
}