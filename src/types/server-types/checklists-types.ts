import type { checklistItems, checklistPacks } from "@/database/schema/tasks";

/** پارامترهای مسیر /api/checklists/[checklistId] */
export interface IChecklistRouteParams {
  params: Promise<{ checklistId: string }>;
}

/** پارامترهای مسیر /api/checklists/[checklistId]/items(/[itemId]) */
export interface IChecklistItemRouteParams {
  params: Promise<{ checklistId: string; itemId: string }>;
}

export type ChecklistPackRow = typeof checklistPacks.$inferSelect;
export type ChecklistItemRow = typeof checklistItems.$inferSelect;
