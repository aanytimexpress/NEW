import { Schema, model } from "mongoose";

export interface IUpazila {
  district: Schema.Types.ObjectId;
  slug: string;
  translations: {
    bn: { name: string };
    en: { name: string };
  };
  latitude?: number;
  longitude?: number;
}

const upazilaSchema = new Schema<IUpazila>(
  {
    district: { type: Schema.Types.ObjectId, ref: "District", required: true, index: true },
    slug: { type: String, required: true },
    translations: {
      bn: { name: { type: String, required: true } },
      en: { name: { type: String, required: true } }
    },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  { timestamps: true }
);

upazilaSchema.index({ district: 1, slug: 1 }, { unique: true });

export const UpazilaModel = model<IUpazila>("Upazila", upazilaSchema);
