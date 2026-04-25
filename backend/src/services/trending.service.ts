import dayjs from "dayjs";
import { ArticleModel } from "../models/article.model.js";

export async function refreshTrendingFlags(): Promise<number> {
  const cutoff = dayjs().subtract(24, "hour").toDate();

  const recent = await ArticleModel.find({
    status: "published",
    publishedAt: { $gte: cutoff }
  })
    .select("_id viewCount publishedAt")
    .lean();

  if (!recent.length) {
    await ArticleModel.updateMany({ isTrending: true }, { $set: { isTrending: false } });
    return 0;
  }

  const scored = recent
    .map((item) => {
      const ageHours = Math.max(
        1,
        dayjs().diff(dayjs(item.publishedAt ?? new Date()), "hour")
      );
      const score = item.viewCount / ageHours;
      return { id: item._id.toString(), score };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 10).map((item) => item.id);

  await ArticleModel.updateMany({ isTrending: true }, { $set: { isTrending: false } });
  if (top.length) {
    await ArticleModel.updateMany({ _id: { $in: top } }, { $set: { isTrending: true } });
  }

  return top.length;
}
