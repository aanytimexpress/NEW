import { Schema, model } from "mongoose";

export interface IDistrict {
  slug: string;
  translations: {
    bn: { name: string };
    en: { name: string };
  };
  latitude?: number;
  longitude?: number;
}

const districtSchema = new Schema<IDistrict>(
  {
    slug: { type: String, required: true, unique: true },
    translations: {
      bn: { name: { type: String, required: true } },
      en: { name: { type: String, required: true } }
    },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  { timestamps: true }
);

export const DistrictModel = model<IDistrict>("District", districtSchema);
