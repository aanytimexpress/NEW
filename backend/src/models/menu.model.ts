import { Schema, model } from "mongoose";

interface MenuTranslation {
  label: string;
  url: string;
}

interface MenuItem {
  id: string;
  parentId?: string;
  translations: {
    bn: MenuTranslation;
    en: MenuTranslation;
  };
  order: number;
  isMegaMenu: boolean;
}

export interface IMenu {
  name: string;
  location: "header" | "footer" | "mobile";
  items: MenuItem[];
}

const menuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true },
    location: { type: String, enum: ["header", "footer", "mobile"], required: true },
    items: [
      {
        id: { type: String, required: true },
        parentId: { type: String },
        translations: {
          bn: {
            label: { type: String, required: true },
            url: { type: String, required: true }
          },
          en: {
            label: { type: String, required: true },
            url: { type: String, required: true }
          }
        },
        order: { type: Number, default: 0 },
        isMegaMenu: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export const MenuModel = model<IMenu>("Menu", menuSchema);
