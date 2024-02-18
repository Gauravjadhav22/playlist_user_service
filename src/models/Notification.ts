import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: string;
  content: string;
  createdAt: Date;
  readBy: boolean;
}

const notificationSchema: Schema<INotification> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
