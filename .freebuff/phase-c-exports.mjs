import fs from "node:fs";

const edits = [
  // vehicles types: update inputs no longer consumed anywhere
  {
    file: "src/features/vehicles/types/index.ts",
    ops: [
      [/\r?\nexport type UpdateServiceInput = Partial<CreateServiceInput>;/, ""],
      [/\r?\nexport type UpdateInsuranceInput = Partial<CreateInsuranceInput>;/, ""],
    ],
  },
  // notifications types: dead preferences interface (last block)
  {
    file: "src/features/notifications/types/index.ts",
    ops: [[/\r?\nexport interface NotificationPreferences \{[\s\S]*$/, ""]],
    eolFix: true,
  },
  // auth: dead type alias
  {
    file: "src/features/auth/utils/security-questions.ts",
    ops: [[/\r?\nexport type SecurityQuestion = \(typeof SECURITY_QUESTIONS\)\[number\];\s*$/, ""]],
    eolFix: true,
  },
  // loans validation: dead form value types (no loan form exists)
  {
    file: "src/features/loans/validations/loan-schema.ts",
    ops: [
      [/export type LoanFormValues = z\.infer<typeof loanFormSchema>;\r?\n/, ""],
      [/export type LoanFormInput = z\.input<typeof loanFormSchema>;\r?\n/, ""],
    ],
  },
  // checklist validation: dead payload type + dead form interface
  {
    file: "src/features/tasks/validations/checklist-schema.ts",
    ops: [
      [/export type UpdateChecklistItemPayload = z\.infer<\r?\n  typeof updateChecklistItemSchema\r?\n>;\r?\n/, ""],
      [/\r?\n\/\*\* فرم دیالوگ ساخت چک‌لیست[^\n]*\*\/\r?\nexport interface ChecklistForm \{\r?\n  title: string;\r?\n  items: string\[\];\r?\n\}\r?\n/, "\n"],
    ],
  },
  // reminder validation: dead payloads + dead parse function
  {
    file: "src/features/tasks/validations/reminder-schema.ts",
    ops: [
      [/export type CreateReminderPayload = z\.infer<typeof createReminderSchema>;\r?\n/, ""],
      [/export type UpdateReminderPayload = z\.infer<typeof updateReminderSchema>;\r?\n/, ""],
      [/\r?\nexport function parseUpdateReminderPayload\([\s\S]*?\n\}\r?\n/, "\n"],
    ],
  },
  // vehicles validation form types (no update forms in UI)
  {
    file: "src/features/vehicles/validations/insurance-schema.ts",
    ops: [[/export type UpdateInsuranceForm = z\.infer<typeof updateInsuranceSchema>;\r?\n/, ""]],
  },
  {
    file: "src/features/vehicles/validations/service-schema.ts",
    ops: [[/export type UpdateServiceForm = z\.infer<typeof updateServiceSchema>;\r?\n/, ""]],
  },
  {
    file: "src/features/vehicles/validations/toll-schema.ts",
    ops: [[/export type UpdateTollForm = z\.infer<typeof updateTollSchema>;\r?\n/, ""]],
  },
  {
    file: "src/features/vehicles/validations/vehicle-schema.ts",
    ops: [[/export type UpdateVehicleForm = z\.infer<typeof updateVehicleSchema>;\r?\n/, ""]],
  },
  // notification store: dead selector (only tests referenced it)
  {
    file: "src/features/notifications/utils/notification-store.ts",
    ops: [[/\r?\n\/\*\*\r?\n \* اعلان‌هایی که از آخرین بازدید[\s\S]*$/, ""]],
    eolFix: true,
  },
  // its test block + import entry
  {
    file: "src/features/notifications/utils/notification-store-test.ts",
    ops: [
      [/  selectUnseenSince,\r?\n/, ""],
      [/describe\("selectUnseenSince", \(\) => \{[\s\S]*?\n\}\);\r?\n\r?\n?/, ""],
    ],
  },
];

for (const { file, ops, eolFix } of edits) {
  if (!fs.existsSync(file)) throw new Error("missing file: " + file);
  let text = fs.readFileSync(file, "utf8");
  for (const [re, replacement] of ops) {
    if (!re.test(text)) {
      console.warn("PATTERN MISS in", file, "->", re);
      continue;
    }
    text = text.replace(re, replacement);
  }
  if (eolFix) text = text.replace(/\s*$/, "\n");
  fs.writeFileSync(file, text);
  console.log("edited:", file);
}
console.log("done");
