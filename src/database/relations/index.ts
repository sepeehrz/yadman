import { relations } from "drizzle-orm";
import { checklistItems, checklistPacks } from "../schema/tasks";

export const checklistPacksRelations = relations(checklistPacks, ({ many }) => ({
  items: many(checklistItems),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  pack: one(checklistPacks, {
    fields: [checklistItems.packId],
    references: [checklistPacks.id],
  }),
}));
