import { apiClient } from "@/lib/api";
import type {
  Checklist,
  ChecklistItem,
  CreateChecklistInput,
  CreateChecklistItemInput,
  CreateReminderInput,
  Reminder,
  UpdateChecklistItemInput,
  UpdateReminderInput,
} from "../types";

export async function getReminders(): Promise<Reminder[]> {
  const { data } = await apiClient.get<Reminder[]>("/reminders");
  return data;
}

export async function createReminder(
  input: CreateReminderInput,
): Promise<Reminder> {
  const { data } = await apiClient.post<Reminder>("/reminders", input);
  return data;
}

export async function updateReminder(
  reminderId: string,
  input: UpdateReminderInput,
): Promise<Reminder> {
  const { data } = await apiClient.patch<Reminder>(
    `/reminders/${reminderId}`,
    input,
  );
  return data;
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await apiClient.delete(`/reminders/${reminderId}`);
}

export async function getChecklists(): Promise<Checklist[]> {
  const { data } = await apiClient.get<Checklist[]>("/checklists");
  return data;
}

export async function createChecklist(
  input: CreateChecklistInput,
): Promise<Checklist> {
  const { data } = await apiClient.post<Checklist>("/checklists", input);
  return data;
}

export async function createChecklistItem(
  checklistId: string,
  input: CreateChecklistItemInput,
): Promise<ChecklistItem> {
  const { data } = await apiClient.post<ChecklistItem>(
    `/checklists/${checklistId}/items`,
    input,
  );
  return data;
}

export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  input: UpdateChecklistItemInput,
): Promise<ChecklistItem> {
  const { data } = await apiClient.patch<ChecklistItem>(
    `/checklists/${checklistId}/items/${itemId}`,
    input,
  );
  return data;
}
