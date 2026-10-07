import type { Checklist, ChecklistItem } from "@/features/tasks/types";
import type { ChecklistItemRow, ChecklistPackRow } from "@/types/server-types";

export function mapChecklistItem(row: ChecklistItemRow): ChecklistItem {
  return {
    id: row.id,
    packId: row.packId,
    text: row.text,
    completed: row.completed,
  };
}

export function mapChecklist(
  row: ChecklistPackRow,
  items: ChecklistItemRow[],
): Checklist {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    icon: row.icon,
    active: row.active,
    items: items.map(mapChecklistItem),
  };
}
