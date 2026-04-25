import { Schema, model } from "mongoose";

export interface IPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  locale: "bn" | "en";
  user?: Schema.Types.ObjectId;
  district?: Schema.Types.ObjectId;
  isActive: boolean;
}

const pushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    },
    locale: { type: String, enum: ["bn", "en"], default: "bn" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    district: { type: Schema.Types.ObjectId, ref: "District" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PushSubscriptionModel = model<IPushSubscription>(
  "PushSubscription",
  pushSubscriptionSchema
);
