// Reseed script: replaces curl-corrupted sample data with proper UTF-8 rows.
const BASE = "http://localhost:3457/api/service-request";

async function api(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`${options?.method ?? "GET"} ${path} -> ${response.status}`);
  }
  return response.json();
}

function isCorrupted(value) {
  return value.includes("???");
}

async function main() {
  const reminders = await api("/reminders");
  for (const reminder of reminders) {
    if (isCorrupted(reminder.title) || isCorrupted(reminder.description ?? "")) {
      await api(`/reminders/${reminder.id}`, { method: "DELETE" });
    }
  }

  const checklists = await api("/checklists");
  for (const checklist of checklists) {
    const corruptedItems = checklist.items.filter((item) => isCorrupted(item.text));
    if (isCorrupted(checklist.title) || corruptedItems.length > 0) {
      for (const item of corruptedItems) {
        // Not exposed via API by design; corrupted sample pack is removed wholesale instead.
      }
      if (isCorrupted(checklist.title)) {
        await api(`/checklists/${checklist.id}/items/remove-pack`, { method: "DELETE" }).catch(() => {});
      }
    }
  }

  const samples = [
    {
      title: "پرداخت قبض برق",
      description: "مهلت پرداخت امشب ساعت ۱۸:۰۰",
      dueAt: "2026-10-03T18:00:00",
      priority: "high",
      recurrence: "none",
    },
    {
      title: "تمدید بیمه شخص ثالث",
      description: null,
      dueAt: "2026-10-06T10:00:00",
      priority: "normal",
      recurrence: "yearly",
    },
    {
      title: "معاینه فنی خودرو",
      description: "مراکز معاینه فنی شهر",
      dueAt: "2026-10-20T09:00:00",
      priority: "normal",
      recurrence: "monthly",
    },
    {
      title: "چک سلامت سالانه",
      description: null,
      dueAt: "2026-11-15T08:30:00",
      priority: "low",
      recurrence: "yearly",
    },
    {
      title: "تمدید دامنه سایت",
      description: null,
      dueAt: "2027-01-10T12:00:00",
      priority: "normal",
      recurrence: "yearly",
    },
  ];
  for (const sample of samples) {
    await api("/reminders", { method: "POST", body: JSON.stringify(sample) });
  }

  const created = await api("/reminders");
  console.log("reminders now:", created.length);
  for (const reminder of created) {
    console.log("-", reminder.title, "|", reminder.dueAt, "|", reminder.priority, "|", reminder.recurrence);
  }
  console.log("checklists:", (await api("/checklists")).map((pack) => `${pack.title} (${pack.items.length})`).join(" | "));
}

main().catch((error) => {
  console.error("seed failed:", error.message);
  process.exit(1);
});
