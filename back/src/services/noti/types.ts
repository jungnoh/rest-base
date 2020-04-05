import { ObjectId } from 'bson';

export interface NotiPayload {
  message: string;
  url: string;
  title: string;
}

export interface UserItem {
  id: ObjectId;
  username: string;
  phone: string;
  fcmToken: string;
  allowSMS: boolean;
  allowPush: boolean;
}

export interface NotiDescription<T extends UserItem = UserItem> {
  users: T[];
  payload: NotiPayload;
  sms: boolean;
  push: boolean;
  internal: boolean;
}
