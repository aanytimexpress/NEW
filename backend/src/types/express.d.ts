import type { UserDocument } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: UserDocument;
      requestId?: string;
    }
  }
}

export {};
