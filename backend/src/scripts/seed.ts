import "dotenv/config";
import { connectDatabase } from "../config/database.js";
import { LanguageModel } from "../models/language.model.js";
import { CategoryModel } from "../models/category.model.js";
import { HomepageSectionModel } from "../models/homepage-section.model.js";
import { UserModel } from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";

async function seed() {
  await connectDatabase();

  await LanguageModel.bulkWrite(
    [
      {
        updateOne: {
          filter: { code: "bn" },
          update: {
            code: "bn",
            label: "Bangla",
            nativeLabel: "বাংলা",
            isDefault: true,
            isEnabled: true
          },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { code: "en" },
          update: {
            code: "en",
            label: "English",
            nativeLabel: "English",
            isDefault: false,
            isEnabled: true
          },
          upsert: true
        }
      }
    ],
    { ordered: true }
  );

  const defaultCategories = [
    { slug: "latest", bn: "সর্বশেষ", en: "Latest News" },
    { slug: "politics", bn: "রাজনীতি", en: "Politics" },
    { slug: "local", bn: "স্থানীয়", en: "Local News" },
    { slug: "international", bn: "আন্তর্জাতিক", en: "International" },
    { slug: "sports", bn: "খেলা", en: "Sports" },
    { slug: "business", bn: "ব্যবসা", en: "Business" },
    { slug: "technology", bn: "প্রযুক্তি", en: "Technology" },
    { slug: "entertainment", bn: "বিনোদন", en: "Entertainment" },
    { slug: "editorial", bn: "সম্পাদকীয়", en: "Editorial" },
    { slug: "opinion", bn: "মতামত", en: "Opinion" }
  ];

  for (const category of defaultCategories) {
    await CategoryModel.updateOne(
      { slug: category.slug },
      {
        slug: category.slug,
        translations: {
          bn: { name: category.bn },
          en: { name: category.en }
        }
      },
      { upsert: true }
    );
  }

  const sections = [
    "breakingTicker",
    "heroSlider",
    "trendingBlock",
    "latestFeed",
    "categoryBlocks",
    "videoBlock",
    "photoGalleryBlock",
    "popularSidebar",
    "newsletterBlock",
    "advertisementBlock"
  ];

  await Promise.all(
    sections.map((section, index) =>
      HomepageSectionModel.updateOne(
        { key: section },
        {
          key: section,
          title: { bn: section, en: section },
          enabled: true,
          order: index
        },
        { upsert: true }
      )
    )
  );

  const superAdminName = process.env.SUPER_ADMIN_NAME || "Bogura Kothon Super Admin";
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@bogurakothon.com";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "ChangeMeNow123!";
  const superAdminLocale = process.env.SUPER_ADMIN_LOCALE === "en" ? "en" : "bn";
  const existingAdmin = await UserModel.findOne({ email: superAdminEmail });
  if (!existingAdmin) {
    await UserModel.create({
      name: superAdminName,
      email: superAdminEmail,
      password: superAdminPassword,
      role: ROLES.SUPER_ADMIN,
      locale: superAdminLocale
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed completed.");
  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
