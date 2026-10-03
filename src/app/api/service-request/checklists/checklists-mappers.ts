import type { Checklist, ChecklistItem } from "@/features/tasks/types";
import type {
  checklistItems,
  checklistPacks,
} from "@/database/schema/tasks";

type PackRow = typeof checklistPacks.$inferSelect;
type ItemRow = typeof checklistItems.$inferSelect;

export function mapChecklistItem(row: ItemRow): ChecklistItem {
  return {
    id: row.id,
    packId: row.packId,
    text: row.text,
    completed: row.completed,
  };
}

export function mapChecklist(row: PackRow, items: ItemRow[]): Checklist {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    icon: row.icon,
    active: row.active,
    items: items.map(mapChecklistItem),
  };
}
