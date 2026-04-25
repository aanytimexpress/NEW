import { ActivityLogModel } from "../models/activity-log.model.js";

interface LogPayload {
  actor: string;
  action: string;
  entityType: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function writeActivityLog(payload: LogPayload): Promise<void> {
  await ActivityLogModel.create(payload);
}
