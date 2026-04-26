import type { ArticleDocument } from "../models/article.model.js";
import type { UserDocument } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: UserDocument;
      authArticle?: ArticleDocument;
      requestId?: string;
    }
  }
}

export {};
