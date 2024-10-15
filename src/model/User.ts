import { IUser } from "../types/user";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema<IUser> = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  picture: { type: String },
  tournaments: [
    {
      cardgame_id: { type: String, required: true },
      amount: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date },
      isExpired: { type: Boolean },
    },
  ],
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
  permissions: [
    {
      name: { type: String, required: true },
    },
  ],
  total_credits: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  current_store: { type: String, ref: "Store" },
});

export default mongoose.model<IUser>("User", UserSchema);
