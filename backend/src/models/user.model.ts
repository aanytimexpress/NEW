import bcrypt from "bcryptjs";
import { Schema, model, type HydratedDocument } from "mongoose";
import { LOCALES, ROLES, type Locale, type Role } from "../constants/roles.js";

interface IUserBase {
  name: string;
  email: string;
  password: string;
  role: Role;
  locale: Locale;
  bio?: string;
  avatarUrl?: string;
  district?: Schema.Types.ObjectId;
  upazila?: Schema.Types.ObjectId;
  isActive: boolean;
  is2FAEnabled: boolean;
  twoFASecret?: string;
  adminIpWhitelist: string[];
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
}

export interface IUser extends IUserBase {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.SUBSCRIBER,
      required: true
    },
    locale: { type: String, enum: LOCALES, default: "bn" },
    bio: { type: String },
    avatarUrl: { type: String },
    district: { type: Schema.Types.ObjectId, ref: "District" },
    upazila: { type: Schema.Types.ObjectId, ref: "Upazila" },
    isActive: { type: Boolean, default: true },
    is2FAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String, select: false },
    adminIpWhitelist: [{ type: String }],
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });

userSchema.pre("save", async function onSave(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.comparePassword = async function comparePassword(
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export type UserDocument = HydratedDocument<IUser>;
export const UserModel = model<IUser>("User", userSchema);
