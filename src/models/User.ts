import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  accessToken: string;
  linkedAccounts?: string[];
  followers?: number;
  totalLikes?: number;
  profilePicture?: string;
  description?: string;
  verifyOtp?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: false },
    description: { type: String, required: false },
    followers: { type: Number, default: 0, min: 0 },
    verifyOtp: { type: String, required:false },
    totalLikes: { type: Number, default: 0, min: 0 },
    password: { type: String, required: true },
    linkedAccounts: { type: [String], required: false },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
