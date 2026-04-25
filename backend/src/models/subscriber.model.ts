import { Schema, model } from "mongoose";

export interface ISubscriber {
  email: string;
  locale: "bn" | "en";
  isActive: boolean;
  source: "web" | "mailchimp";
  mailchimpId?: string;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    locale: { type: String, enum: ["bn", "en"], default: "bn" },
    isActive: { type: Boolean, default: true },
    source: { type: String, enum: ["web", "mailchimp"], default: "web" },
    mailchimpId: { type: String }
  },
  { timestamps: true }
);

export const SubscriberModel = model<ISubscriber>("Subscriber", subscriberSchema);
