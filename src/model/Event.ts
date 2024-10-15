import { IEvent } from "../types/event";
import mongoose, { Schema } from "mongoose";

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  picture: { type: String },
  music: { type: String },
  colors: {
    1: { type: String },
    2: { type: String },
    3: { type: String },
  },
  location: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IEvent>("Event", EventSchema);
