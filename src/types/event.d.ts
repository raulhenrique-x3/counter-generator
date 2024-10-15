import { Document } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  description: string;
  date: Date;
  picture: string;
  music: string;
  colors: {
    1: string;
    2: string;
    3: string;
  };
  location: string;
  creator: string;
  createdAt: Date;
}
