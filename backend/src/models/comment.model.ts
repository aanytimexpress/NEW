import { Schema, model } from "mongoose";

export interface IComment {
  article: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  isSpam: boolean;
  isApproved: boolean;
  moderatedBy?: Schema.Types.ObjectId;
  moderatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    article: { type: Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
    isSpam: { type: Boolean, default: false, index: true },
    isApproved: { type: Boolean, default: false, index: true },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    moderatedAt: { type: Date }
  },
  { timestamps: true }
);

export const CommentModel = model<IComment>("Comment", commentSchema);
