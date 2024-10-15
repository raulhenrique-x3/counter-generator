import { Document } from "mongoose";
export interface IUser extends Document {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  picture: string;
  createdAt: Date;
  tournaments: ICredit[];
  stores: string[];
  permissions: string[];
  current_store: string;
  total_credits: number;
}
