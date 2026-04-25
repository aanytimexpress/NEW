import { Schema, model } from "mongoose";

export interface INotification {
  title: string;
  message: string;
  locale: "bn" | "en";
  audience:
    | "all"
    | "subscribers"
    | "admins"
    | "editors"
    | "reporters"
    | "authors"
    | "district";
  district?: Schema.Types.ObjectId;
  isSent: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    locale: { type: String, enum: ["bn", "en"], default: "bn" },
    audience: {
      type: String,
      enum: ["all", "subscribers", "admins", "editors", "reporters", "authors", "district"],
      default: "all"
    },
    district: { type: Schema.Types.ObjectId, ref: "District" },
    isSent: { type: Boolean, default: false },
    scheduledAt: { type: Date },
    sentAt: { type: Date }
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
